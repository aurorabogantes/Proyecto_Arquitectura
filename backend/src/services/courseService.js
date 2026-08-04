const repository = require("../repositories/CourseRepository");
const Course = require("../models/Course");
const gamificationService = require("./gamificationService");

class CourseService {

    async getAllCourses() {
        const rows = await repository.obtenerCursos();
        return rows.map(r => new Course({
            id: r.CursoId,
            title: r.Titulo,
            description: r.Descripcion,
            level: r.Nivel,
            ageRange: r.RangoEdad,
            thumbnail: r.Thumbnail,
            category: r.Categoria,
            points: r.Puntos,
            duration: r.Duracion
        }));
    }

    async getCourseById(id) {
        const data = await repository.obtenerCurso(id);
        if (!data) return null;
        return new Course({
            id: data.CursoId,
            title: data.Titulo,
            description: data.Descripcion,
            level: data.Nivel,
            ageRange: data.RangoEdad,
            thumbnail: data.Thumbnail,
            category: data.Categoria,
            points: data.Puntos,
            duration: data.Duracion,
            lessons: (data.lecciones || []).map(l => ({
                id: l.LeccionId,
                title: l.Titulo,
                duration: l.Duracion,
                type: l.Tipo
            })),
            mediaItems: (data.mediaItems || []).map(m => ({
                id: m.MediaId,
                type: m.Tipo,
                url: m.Url,
                title: m.Titulo
            }))
        });
    }

    async enrollStudent(estudianteId, cursoId) {
        const resultado = await repository.inscribirEstudiante(estudianteId, cursoId);
        await gamificationService.evaluarDesafiosTrasInscripcion(estudianteId);
        const nuevasInsignias = await gamificationService.verificarInsignias(estudianteId);
        return { ...resultado, nuevasInsignias };
    }
}

module.exports = new CourseService();
