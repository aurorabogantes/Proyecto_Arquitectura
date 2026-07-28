const repository = require("../repositories/ProgressRepository");
const StudentProgress = require("../models/StudentProgress");

class ProgressService {

    async getProgressByStudent(estudianteId) {
        const filas = await repository.obtenerProgresoPorEstudiante(estudianteId);
        return filas.map(f => new StudentProgress({
            estudianteId: f.EstudianteId,
            nombre: f.Nombre,
            cursoId: f.CursoId,
            tituloCurso: f.TituloCurso,
            porcentaje: f.Porcentaje,
            completado: f.Completado,
            fechaMatricula: f.FechaMatricula,
            leccionesCompletadas: f.LeccionesCompletadas,
            totalLecciones: f.TotalLecciones
        }));
    }

    async getProgressByCourse(cursoId) {
        const filas = await repository.obtenerProgresoPorCurso(cursoId);
        return filas.map(f => new StudentProgress({
            estudianteId: f.EstudianteId,
            nombre: f.Nombre,
            cursoId: f.CursoId,
            tituloCurso: f.TituloCurso,
            porcentaje: f.Porcentaje,
            completado: f.Completado,
            fechaMatricula: f.FechaMatricula,
            leccionesCompletadas: f.LeccionesCompletadas,
            totalLecciones: f.TotalLecciones
        }));
    }

    async getLessonsWithProgress(estudianteId, cursoId) {
        return await repository.obtenerLeccionesConProgreso(estudianteId, cursoId);
    }

    async completeLesson(estudianteId, leccionId, puntuacion) {
        if (!estudianteId || !leccionId) {
            throw new Error("estudianteId y leccionId son requeridos");
        }
        return await repository.marcarLeccionCompletada(estudianteId, leccionId, puntuacion);
    }

    async getActivityHistory(estudianteId) {
        return await repository.obtenerHistorialActividades(estudianteId);
    }

    async trackUsageTime(estudianteId, minutos) {
        if (!minutos || minutos <= 0) {
            throw new Error("minutos debe ser mayor a 0");
        }
        return await repository.registrarTiempoUso(estudianteId, minutos);
    }

    async getTotalUsageTime(estudianteId) {
        return await repository.obtenerTiempoUsoTotal(estudianteId);
    }
}

module.exports = new ProgressService();
