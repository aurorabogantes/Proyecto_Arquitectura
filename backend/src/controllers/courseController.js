const courseService = require("../services/courseService");

const courseController = {

    async index(req, res) {

        try {

            const courses = await courseService.getAllCourses();

            res.json(courses);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }

};

module.exports = courseController;