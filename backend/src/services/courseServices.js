// Para integrar DB: reemplaza los metodos con queries (ej. findAll(), Course.findByPk(id))
const { courses: mockCourses } = require('../data/mockData');
const Course = require('../models/Course');

class CourseService {
    getAllCourses() {
        return mockCourses.map(c => new Course(c));
    }

    getCourseById(id) {
        const raw = mockCourses.find(c => c.id === parseInt(id));
        return raw ? new Course(raw) : null;
    }

    getCategories() {
        return [...new Set(mockCourses.map(c => c.category))];
    }

    getLevels() {
        return [...new Set(mockCourses.map(c => c.level))];
    }
}

module.exports = new CourseService();