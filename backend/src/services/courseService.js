const repository = require("../repositories/CourseRepository");

class CourseService {

    async getAllCourses() {

        return await repository.obtenerCursos();

    }

}

module.exports = new CourseService();