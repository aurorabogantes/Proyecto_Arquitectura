const { sql, config } = require("../database/connection");

// RF-11 / RF-12: avance de un estudiante en cada curso en el que está inscrito
async function obtenerProgresoPorEstudiante(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT
                    ec.EstudianteId,
                    e.Nombre,
                    ec.CursoId,
                    c.Titulo AS TituloCurso,
                    ec.Porcentaje,
                    ec.Completado,
                    ec.FechaMatricula,
                    (
                        SELECT COUNT(*) FROM ProgresoLeccion pl
                        INNER JOIN Lecciones l ON l.LeccionId = pl.LeccionId
                        WHERE pl.EstudianteId = ec.EstudianteId
                          AND l.CursoId = ec.CursoId
                          AND pl.Completado = 1
                    ) AS LeccionesCompletadas,
                    (
                        SELECT COUNT(*) FROM Lecciones l WHERE l.CursoId = ec.CursoId
                    ) AS TotalLecciones
                FROM EstudianteCurso ec
                INNER JOIN Estudiantes e ON e.EstudianteId = ec.EstudianteId
                INNER JOIN Cursos c ON c.CursoId = ec.CursoId
                WHERE ec.EstudianteId = @estudianteId
                ORDER BY ec.FechaMatricula DESC
            `);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// RF-20: avance de todos los estudiantes inscritos en un curso (vista docente)
async function obtenerProgresoPorCurso(cursoId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("cursoId", sql.Int, cursoId)
            .query(`
                SELECT
                    ec.EstudianteId,
                    e.Nombre,
                    ec.CursoId,
                    c.Titulo AS TituloCurso,
                    ec.Porcentaje,
                    ec.Completado,
                    ec.FechaMatricula,
                    (
                        SELECT COUNT(*) FROM ProgresoLeccion pl
                        INNER JOIN Lecciones l ON l.LeccionId = pl.LeccionId
                        WHERE pl.EstudianteId = ec.EstudianteId
                          AND l.CursoId = ec.CursoId
                          AND pl.Completado = 1
                    ) AS LeccionesCompletadas,
                    (
                        SELECT COUNT(*) FROM Lecciones l WHERE l.CursoId = ec.CursoId
                    ) AS TotalLecciones
                FROM EstudianteCurso ec
                INNER JOIN Estudiantes e ON e.EstudianteId = ec.EstudianteId
                INNER JOIN Cursos c ON c.CursoId = ec.CursoId
                WHERE ec.CursoId = @cursoId
                ORDER BY e.Nombre
            `);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// RF-06 / RF-07: contenido del curso marcado con lo ya completado por el estudiante
async function obtenerLeccionesConProgreso(estudianteId, cursoId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("cursoId", sql.Int, cursoId)
            .query(`
                SELECT
                    l.LeccionId,
                    l.Titulo,
                    l.Duracion,
                    l.Tipo,
                    ISNULL(pl.Completado, 0) AS Completado,
                    pl.Puntuacion,
                    pl.FechaCompletado
                FROM Lecciones l
                LEFT JOIN ProgresoLeccion pl
                    ON pl.LeccionId = l.LeccionId AND pl.EstudianteId = @estudianteId
                WHERE l.CursoId = @cursoId
                ORDER BY l.LeccionId
            `);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// RF-06: marcar una lección/actividad como completada y registrar su resultado
async function marcarLeccionCompletada(estudianteId, leccionId, puntuacion) {
    try {
        const pool = await sql.connect(config);

        const existente = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("leccionId", sql.Int, leccionId)
            .query(`
                SELECT Id FROM ProgresoLeccion
                WHERE EstudianteId = @estudianteId AND LeccionId = @leccionId
            `);

        if (existente.recordset.length > 0) {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("leccionId", sql.Int, leccionId)
                .input("puntuacion", sql.Decimal(5, 2), puntuacion || null)
                .query(`
                    UPDATE ProgresoLeccion
                    SET Completado = 1, Puntuacion = @puntuacion, FechaCompletado = GETDATE()
                    WHERE EstudianteId = @estudianteId AND LeccionId = @leccionId
                `);
        } else {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("leccionId", sql.Int, leccionId)
                .input("puntuacion", sql.Decimal(5, 2), puntuacion || null)
                .query(`
                    INSERT INTO ProgresoLeccion (EstudianteId, LeccionId, Completado, Puntuacion, FechaCompletado)
                    VALUES (@estudianteId, @leccionId, 1, @puntuacion, GETDATE())
                `);
        }

        // recalcula el % de avance del curso al que pertenece la lección
        const curso = await pool.request()
            .input("leccionId", sql.Int, leccionId)
            .query(`SELECT CursoId FROM Lecciones WHERE LeccionId = @leccionId`);

        if (curso.recordset.length > 0) {
            const cursoId = curso.recordset[0].CursoId;
            await recalcularPorcentajeCurso(pool, estudianteId, cursoId);
        }

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function recalcularPorcentajeCurso(pool, estudianteId, cursoId) {
    const totales = await pool.request()
        .input("estudianteId", sql.Int, estudianteId)
        .input("cursoId", sql.Int, cursoId)
        .query(`
            SELECT
                (SELECT COUNT(*) FROM Lecciones WHERE CursoId = @cursoId) AS Total,
                (
                    SELECT COUNT(*) FROM ProgresoLeccion pl
                    INNER JOIN Lecciones l ON l.LeccionId = pl.LeccionId
                    WHERE pl.EstudianteId = @estudianteId AND l.CursoId = @cursoId AND pl.Completado = 1
                ) AS Completadas
        `);

    const { Total, Completadas } = totales.recordset[0];
    const porcentaje = Total > 0 ? (Completadas / Total) * 100 : 0;
    const completado = Total > 0 && Completadas === Total;

    await pool.request()
        .input("estudianteId", sql.Int, estudianteId)
        .input("cursoId", sql.Int, cursoId)
        .input("porcentaje", sql.Decimal(5, 2), porcentaje)
        .input("completado", sql.Bit, completado)
        .query(`
            UPDATE EstudianteCurso
            SET Porcentaje = @porcentaje, Completado = @completado
            WHERE EstudianteId = @estudianteId AND CursoId = @cursoId
        `);
}

// RF-15: historial de actividades completadas por un estudiante
async function obtenerHistorialActividades(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT
                    pl.FechaCompletado,
                    l.Titulo AS Leccion,
                    l.Tipo,
                    c.Titulo AS Curso,
                    pl.Puntuacion
                FROM ProgresoLeccion pl
                INNER JOIN Lecciones l ON l.LeccionId = pl.LeccionId
                INNER JOIN Cursos c ON c.CursoId = l.CursoId
                WHERE pl.EstudianteId = @estudianteId AND pl.Completado = 1
                ORDER BY pl.FechaCompletado DESC
            `);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// RF-13: registrar tiempo de uso de la plataforma
async function registrarTiempoUso(estudianteId, minutos) {
    try {
        const pool = await sql.connect(config);
        const hoy = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT Id, MinutosUso FROM SesionUso
                WHERE EstudianteId = @estudianteId AND Fecha = CAST(GETDATE() AS DATE)
            `);

        if (hoy.recordset.length > 0) {
            await pool.request()
                .input("id", sql.Int, hoy.recordset[0].Id)
                .input("minutos", sql.Int, hoy.recordset[0].MinutosUso + minutos)
                .query(`UPDATE SesionUso SET MinutosUso = @minutos WHERE Id = @id`);
        } else {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("minutos", sql.Int, minutos)
                .query(`
                    INSERT INTO SesionUso (EstudianteId, Fecha, MinutosUso)
                    VALUES (@estudianteId, CAST(GETDATE() AS DATE), @minutos)
                `);
        }
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// RF-13 / RF-23: total de minutos de uso de un estudiante
async function obtenerTiempoUsoTotal(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT ISNULL(SUM(MinutosUso), 0) AS TotalMinutos
                FROM SesionUso
                WHERE EstudianteId = @estudianteId
            `);
        return resultado.recordset[0].TotalMinutos;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    obtenerProgresoPorEstudiante,
    obtenerProgresoPorCurso,
    obtenerLeccionesConProgreso,
    marcarLeccionCompletada,
    obtenerHistorialActividades,
    registrarTiempoUso,
    obtenerTiempoUsoTotal
};
