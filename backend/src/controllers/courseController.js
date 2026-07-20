const courseService = require('../services/courseServices');
const gamificationService = require('../services/gamificationService');

const courseController = {
    index(req, res) {
        const { category, level, search } = req.query;
        let courses = courseService.getAllCourses();

        if (category) courses = courses.filter(c => c.category === category);
        if (level) courses = courses.filter(c => c.level === level);
        if (search) {
            const q = search.toLowerCase();
            courses = courses.filter(c =>
                c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
            );
        }

        res.json({
            courses: courses.map(c => ({ ...c, levelBadge: c.getLevelBadge() })),
            categories: courseService.getCategories(),
            levels: courseService.getLevels()
        });
    },

    show(req, res) {
        const course = courseService.getCourseById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

        const user = req.session.user;
        res.json({
            course: { ...course, levelBadge: course.getLevelBadge() },
            isEntolled: user ? user.enrolledCourses.includes(course.id) : false
        });
    },

    enroll(req, res) {
        const courseId = parseInt(req.params.id);
        const course = courseService.getCourseById(courseId);
        if (!course) return res.status(404).json({ error: 'Curso no encontrado '});

        req.session.user = gamificationService.enrollCourse(req.session.user, courseId);
        req.session.user = gamificationService.addPoints(req.session.user, 10);

        res.json({
            success: true,
            message: `Te inscribiste en "${course.title}"!`,
            points: 10,
            user: req.session.user
        });
    }
};

module.exports = courseController;