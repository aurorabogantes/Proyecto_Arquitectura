const progressService = require("./progressService");

class ReportService {

    // RF-19 / RF-21: reporte individual (docente o padre/tutor)
    async getStudentReport(estudianteId) {
        const cursos = await progressService.getProgressByStudent(estudianteId);
        const historial = await progressService.getActivityHistory(estudianteId);
        const minutosUso = await progressService.getTotalUsageTime(estudianteId);

        const cursosCompletados = cursos.filter(c => c.completado).length;
        const promedioAvance = cursos.length > 0
            ? Math.round(cursos.reduce((sum, c) => sum + Number(c.porcentaje), 0) / cursos.length)
            : 0;

        return {
            estudianteId: Number(estudianteId),
            nombre: cursos[0]?.nombre || null,
            generadoEl: new Date(),
            resumen: {
                cursosInscritos: cursos.length,
                cursosCompletados,
                promedioAvance,
                minutosUso
            },
            cursos,
            actividadesRecientes: historial.slice(0, 10)
        };
    }

    // RF-20: reporte grupal por curso, para el docente
    async getCourseReport(cursoId) {
        const estudiantes = await progressService.getProgressByCourse(cursoId);

        const promedioAvance = estudiantes.length > 0
            ? Math.round(estudiantes.reduce((sum, e) => sum + Number(e.porcentaje), 0) / estudiantes.length)
            : 0;

        return {
            cursoId: Number(cursoId),
            tituloCurso: estudiantes[0]?.tituloCurso || null,
            generadoEl: new Date(),
            resumen: {
                totalEstudiantes: estudiantes.length,
                completados: estudiantes.filter(e => e.completado).length,
                sinAvance: estudiantes.filter(e => Number(e.porcentaje) === 0).length,
                promedioAvance
            },
            estudiantes
        };
    }
}

module.exports = new ReportService();
