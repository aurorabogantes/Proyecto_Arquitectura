const repository = require('../repositories/GamificationRepository');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const https = require('https');

class GamificationService {

    async getDashboard(estudianteId) {
        await Promise.all([
            this.evaluarDesafiosTrasInscripcion(estudianteId),
            this.evaluarDesafiosTrasLeccion(estudianteId)
        ]);
        await this.verificarInsignias(estudianteId);
        const [datosEstudiante, insignias, niveles, desafios, insigniasGanadas, progresoDesafios] = await Promise.all([
            repository.obtenerDatosEstudiante(estudianteId),
            repository.obtenerInsignias(),
            repository.obtenerNiveles(),
            repository.obtenerDesafios(),
            repository.obtenerInsigniasEstudiante(estudianteId),
            repository.obtenerProgresoDesafios(estudianteId)
        ]);

        if (!datosEstudiante) throw new Error('Estudiante no encontrado');

        const challengeProgressMap = {};
        Object.entries(progresoDesafios).forEach(([k, v]) => {
            challengeProgressMap[k] = v.progreso;
        });

        const user = new User({
            id: datosEstudiante.EstudianteId,
            name: datosEstudiante.Nombre,
            points: datosEstudiante.Puntos || 0,
            streak: datosEstudiante.Racha || 0,
            earnedBadges: insigniasGanadas,
            challengeProgress: challengeProgressMap,
            enrolledCourses: [],
            completedCourses: [],
            joinedDate: datosEstudiante.FechaRegistro
        });

        const levelObjects = niveles.map(n => ({
            level: n.NivelId,
            name: n.Nombre,
            minPoints: n.MinPuntos,
            maxPoints: n.MaxPuntos,
            icon: n.Icono,
            color: n.Color
        }));

        const badgesWithStatus = insignias.map(b => {
            const badge = new Badge({
                id: b.InsigniaId,
                name: b.Nombre,
                description: b.Descripcion,
                icon: b.Icono,
                pointsRequired: b.PuntosRequeridos,
                special: b.Especial,
                color: b.Color
            });
            return { ...badge, isEarned: badge.isEarned(user) };
        });

        const challengesWithProgress = desafios.map(c => {
            const challenge = new Challenge({
                id: c.DesafioId,
                title: c.Titulo,
                description: c.Descripcion,
                icon: c.Icono,
                reward: c.Recompensa,
                type: c.Tipo,
                target: c.Objetivo,
                expiresIn: c.Expira
            });
            const userProg = user.challengeProgress[c.DesafioId] || 0;
            return {
                ...challenge,
                userProgress: userProg,
                progressPct: challenge.getProgressPercentage(userProg),
                isCompleted: challenge.isCompleted(userProg)
            };
        });

        const currentLevel = user.getLevel(levelObjects);
        const progress = user.getProgressToNextLevel(levelObjects);

        return { user, badges: badgesWithStatus, challenges: challengesWithProgress, levels: levelObjects, currentLevel, progress };
    }

    async updateChallengeProgress(estudianteId, desafioId, progreso) {
        await repository.actualizarProgresoDesafio(estudianteId, desafioId, progreso);
        return true;
    }

    async addPoints(estudianteId, puntos) {
        await repository.agregarPuntos(estudianteId, puntos);
        // Verificar y otorgar insignias basadas en puntos
        const nuevasInsignias = await this.verificarInsignias(estudianteId);
        return { nuevasInsignias };
    }

    // Comprueba qué insignias por puntos aún no tiene el estudiante y las otorga
    async verificarInsignias(estudianteId) {
        try {
            const [insignias, ganadas, datos, estadisticas, cursosCompletados] = await Promise.all([
                repository.obtenerInsignias(),
                repository.obtenerInsigniasEstudiante(estudianteId),
                repository.obtenerDatosEstudiante(estudianteId),
                repository.obtenerEstadisticasInsignias(estudianteId),
                repository.obtenerCursosCompletados(estudianteId)
            ]);
            if (!datos) return [];
            const nuevas = [];
            for (const ins of insignias) {
                if (ganadas.includes(ins.InsigniaId)) continue;
                const porPuntos = !ins.Especial && ins.PuntosRequeridos > 0 && datos.Puntos >= ins.PuntosRequeridos;
                const porCondicionEspecial = this.cumpleCondicionEspecial(
                    ins.Especial, datos, estadisticas, cursosCompletados
                );
                if (porPuntos || porCondicionEspecial) {
                    const otorgada = await repository.otorgarInsignia(estudianteId, ins.InsigniaId);
                    if (otorgada) nuevas.push({ id: ins.InsigniaId, nombre: ins.Nombre, icono: ins.Icono, color: ins.Color });
                }
            }
            return nuevas;
        } catch (e) {
            console.log('verificarInsignias:', e.message);
            return [];
        }
    }

    cumpleCondicionEspecial(especial, datos, estadisticas, cursosCompletados) {
        if (!especial) return false;
        if (especial === 'courses_3') return estadisticas.CursosInscritos >= 3;
        if (especial === 'all_courses') {
            return estadisticas.TotalCursos > 0 && estadisticas.CursosCompletados >= estadisticas.TotalCursos;
        }
        if (especial === 'project') return estadisticas.ProyectosCompletados > 0;

        const curso = especial.match(/^course_(\d+)$/);
        if (curso) return cursosCompletados.includes(Number(curso[1]));

        const racha = especial.match(/^streak_(\d+)$/);
        return !!racha && datos.Racha >= Number(racha[1]);
    }

    // ── Auto-evaluación de desafíos ──────────────────────────────────────

    // Llamar después de que un estudiante se inscribe en un curso.
    // Busca desafíos de tipo inscripción (descripción contiene "inscri")
    // y actualiza su progreso con el conteo real de inscripciones.
    async evaluarDesafiosTrasInscripcion(estudianteId) {
        try {
            const [desafios, total] = await Promise.all([
                repository.obtenerDesafios(),
                repository.obtenerCursosInscritosHoyCount(estudianteId)
            ]);
            const relevantes = desafios.filter(d =>
                d.Descripcion?.toLowerCase().includes('inscr') ||
                d.Titulo?.toLowerCase().includes('inscr')
            );
            const avances = [];
            for (const d of relevantes) {
                const progreso = Math.min(Number(total), d.Objetivo);
                const estado = await repository.actualizarProgresoDesafio(estudianteId, d.DesafioId, progreso);
                if (estado.completadoAhora) {
                    await repository.agregarPuntos(estudianteId, d.Recompensa);
                }
                avances.push({ id: d.DesafioId, titulo: d.Titulo, icono: d.Icono, progreso, objetivo: d.Objetivo, recompensa: d.Recompensa, completadoAhora: estado.completadoAhora });
            }
            return avances;
        } catch (e) {
            console.log('evaluarDesafiosTrasInscripcion:', e.message);
            return [];
        }
    }

    // Llamar después de completar una lección.
    // Busca desafíos de tipo lección (descripción contiene "lección" o "lecciones")
    // y actualiza con el conteo de lecciones completadas esta semana.
    async evaluarDesafiosTrasLeccion(estudianteId) {
        try {
            const [desafios, leccionesSemanales, cursosScratch] = await Promise.all([
                repository.obtenerDesafios(),
                repository.obtenerLeccionesSemanalesCount(estudianteId),
                repository.obtenerCursosScratchCompletadosSemanaCount(estudianteId)
            ]);
            const avances = [];
            for (const d of desafios) {
                const descripcion = `${d.Titulo || ''} ${d.Descripcion || ''}`.toLowerCase();
                const total = descripcion.includes('scratch') ? cursosScratch :
                    descripcion.includes('lecci') ? leccionesSemanales : null;
                if (total === null) continue;
                const progreso = Math.min(Number(total), d.Objetivo);
                const estado = await repository.actualizarProgresoDesafio(estudianteId, d.DesafioId, progreso);
                if (estado.completadoAhora) {
                    await repository.agregarPuntos(estudianteId, d.Recompensa);
                }
                if (progreso > 0) avances.push({ id: d.DesafioId, titulo: d.Titulo, icono: d.Icono, progreso, objetivo: d.Objetivo, recompensa: d.Recompensa, completadoAhora: estado.completadoAhora });
            }
            return avances;
        } catch (e) {
            console.log('evaluarDesafiosTrasLeccion:', e.message);
            return [];
        }
    }

    // Llamar al terminar una trivia con N aciertos correctos.
    // Busca desafíos de tipo trivia (descripción contiene "trivia")
    // y añade los aciertos al progreso acumulado.
    async evaluarDesafiosTrasTrivia(estudianteId, aciertos) {
        try {
            const desafios = await repository.obtenerDesafios();
            const relevantes = desafios.filter(d =>
                d.Descripcion?.toLowerCase().includes('trivia')
            );
            const avances = [];
            for (const d of relevantes) {
                const estado = await repository.incrementarProgresoDesafio(
                    estudianteId, d.DesafioId, aciertos
                );
                if (estado.Completado && !estado.YaCompletado) {
                    await repository.agregarPuntos(estudianteId, d.Recompensa);
                }
                if (estado.Progreso > 0) avances.push({ id: d.DesafioId, titulo: d.Titulo, icono: d.Icono, progreso: estado.Progreso, objetivo: d.Objetivo, recompensa: d.Recompensa, completadoAhora: estado.Completado && !estado.YaCompletado });
            }
            return avances;
        } catch (e) {
            console.log('evaluarDesafiosTrasTrivia:', e.message);
            return [];
        }
    }

    getTriviaQuestions() {
        return new Promise((resolve) => {
            const url = 'https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple';
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.response_code === 0) {
                            resolve(parsed.results.map(question => ({
                                question: question.question,
                                correctAnswer: question.correct_answer,
                                options: [...question.incorrect_answers, question.correct_answer]
                                    .sort(() => Math.random() - 0.5)
                            })));
                        } else {
                            resolve([]);
                        }
                    } catch {
                        resolve([]);
                    }
                });
            }).on('error', () => resolve([]));
        });
    }
}

module.exports = new GamificationService();
