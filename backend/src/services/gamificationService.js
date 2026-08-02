const repository = require('../repositories/GamificationRepository');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const https = require('https');

class GamificationService {

    async getDashboard(estudianteId) {
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
        return true;
    }

    // Integración con Open Trivia Database (https://opentdb.com) – categoría 18: Computers
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
                            const questions = parsed.results.map(q => ({
                                question: q.question,
                                correctAnswer: q.correct_answer,
                                options: [...q.incorrect_answers, q.correct_answer]
                                    .sort(() => Math.random() - 0.5)
                            }));
                            resolve(questions);
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
