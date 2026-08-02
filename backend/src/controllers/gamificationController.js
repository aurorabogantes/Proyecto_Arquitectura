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
            const resultado = await gamificationService.addPoints(parseInt(estudianteId), parseInt(puntos));
            res.json({ success: true, ...resultado });
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
    },

    // POST /api/gamification/trivia-resultado  { estudianteId, aciertos }
    // Registra aciertos de trivia hacia los desafíos relacionados y otorga puntos
    async triviaResultado(req, res) {
        try {
            const { estudianteId, aciertos } = req.body;
            if (!estudianteId) return res.status(400).json({ error: 'estudianteId es requerido' });
            const n = parseInt(aciertos) || 0;
            const [puntosResult] = await Promise.all([
                gamificationService.addPoints(parseInt(estudianteId), n * 15),
                gamificationService.evaluarDesafiosTrasTrivia(parseInt(estudianteId), n)
            ]);
            res.json({ success: true, puntosGanados: n * 15, nuevasInsignias: puntosResult.nuevasInsignias || [] });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

};

module.exports = gamificationController;
