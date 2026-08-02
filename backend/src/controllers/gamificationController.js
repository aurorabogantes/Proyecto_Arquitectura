const gamificationService = require('../services/gamificationService');

const gamificationController = {

    async dashboard(req, res) {
        try {
            const estudianteId = parseInt(req.query.estudianteId) || 1;
            const data = await gamificationService.getDashboard(estudianteId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateProgress(req, res) {
        try {
            const { estudianteId, retoId, progreso } = req.body;
            if (!estudianteId || !retoId) return res.status(400).json({ error: 'estudianteId y retoId son requeridos' });
            await gamificationService.updateChallengeProgress(
                parseInt(estudianteId), parseInt(retoId), parseInt(progreso) || 0
            );
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async addPoints(req, res) {
        try {
            const { estudianteId, puntos } = req.body;
            if (!estudianteId || !puntos) return res.status(400).json({ error: 'estudianteId y puntos son requeridos' });
            await gamificationService.addPoints(parseInt(estudianteId), parseInt(puntos));
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async trivia(req, res) {
        try {
            const questions = await gamificationService.getTriviaQuestions();
            res.json({ questions });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};

module.exports = gamificationController;
