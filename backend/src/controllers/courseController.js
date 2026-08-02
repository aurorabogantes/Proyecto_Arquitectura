const courseService = require("../services/courseService");

const courseController = {

    async index(req, res) {
        try {
            const courses = await courseService.getAllCourses();
            res.json(courses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async show(req, res) {
        try {
            const course = await courseService.getCourseById(req.params.id);
            if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
            res.json(course);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async enroll(req, res) {
        try {
            const { estudianteId } = req.body;
            if (!estudianteId) return res.status(400).json({ error: 'estudianteId es requerido' });
            const result = await courseService.enrollStudent(estudianteId, req.params.id);
            res.json({ success: true, ...result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};

module.exports = courseController;
