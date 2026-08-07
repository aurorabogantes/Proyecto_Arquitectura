const { sql, config } = require("../database/connection");

async function obtenerCursos() {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request().query(`
            SELECT CursoId, Titulo, Descripcion, Nivel, RangoEdad,
                   Thumbnail, Categoria, Puntos, Duracion
            FROM Cursos
            ORDER BY CursoId
        `);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerCurso(cursoId) {
    try {
        const pool = await sql.connect(config);

        const cursoRes = await pool.request()
            .input("cursoId", sql.Int, cursoId)
            .query(`
                SELECT CursoId, Titulo, Descripcion, Nivel, RangoEdad,
                       Thumbnail, Categoria, Puntos, Duracion
                FROM Cursos WHERE CursoId = @cursoId
            `);
        if (cursoRes.recordset.length === 0) return null;

        const leccionesRes = await pool.request()
            .input("cursoId", sql.Int, cursoId)
            .query(`
                SELECT LeccionId, Titulo, Duracion, Tipo
                FROM Lecciones WHERE CursoId = @cursoId
                ORDER BY LeccionId
            `);

        let mediaItems = [];
        try {
            const mediaRes = await pool.request()
                .input("cursoId", sql.Int, cursoId)
                .query(`
                    SELECT MediaId, Tipo, Url, Titulo
                    FROM MediaItems WHERE CursoId = @cursoId
                    ORDER BY MediaId
                `);
            mediaItems = mediaRes.recordset;
        } catch { /* tabla opcional */ }

        return {
            ...cursoRes.recordset[0],
            lecciones: leccionesRes.recordset,
            mediaItems
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function inscribirEstudiante(estudianteId, cursoId) {
    try {
        const pool = await sql.connect(config);
        const existe = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("cursoId", sql.Int, cursoId)
            .query(`
                SELECT EstudianteId FROM EstudianteCurso
                WHERE EstudianteId = @estudianteId AND CursoId = @cursoId
            `);
        if (existe.recordset.length > 0) return { alreadyEnrolled: true };
        await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("cursoId", sql.Int, cursoId)
            .query(`
                INSERT INTO EstudianteCurso (EstudianteId, CursoId, Porcentaje, Completado, FechaMatricula)
                VALUES (@estudianteId, @cursoId, 0, 0, GETDATE())
            `);
        return { alreadyEnrolled: false };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { obtenerCursos, obtenerCurso, inscribirEstudiante };
