const progressService = require("../services/progressService");

const progressController = {

    // GET /api/progress/student/:estudianteId
    async byStudent(req, res) {
        try {
            const progreso = await progressService.getProgressByStudent(req.params.estudianteId);
            res.json(progreso);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/progress/course/:cursoId
    async byCourse(req, res) {
        try {
            const progreso = await progressService.getProgressByCourse(req.params.cursoId);
            res.json(progreso);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/progress/student/:estudianteId/course/:cursoId/lessons
    async lessons(req, res) {
        try {
            const { estudianteId, cursoId } = req.params;
            const lecciones = await progressService.getLessonsWithProgress(estudianteId, cursoId);
            res.json(lecciones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/progress/complete-lesson  { estudianteId, leccionId, puntuacion }
    async completeLesson(req, res) {
        try {
            const { estudianteId, leccionId, puntuacion } = req.body;
            const resultado = await progressService.completeLesson(estudianteId, leccionId, puntuacion);
            res.json({ success: true, ...resultado });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // GET /api/progress/student/:estudianteId/history
    async history(req, res) {
        try {
            const historial = await progressService.getActivityHistory(req.params.estudianteId);
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/progress/time  { estudianteId, minutos }
    async trackTime(req, res) {
        try {
            const { estudianteId, minutos } = req.body;
            await progressService.trackUsageTime(estudianteId, minutos);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

};

module.exports = progressController;
