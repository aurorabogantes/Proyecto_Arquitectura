const { sql, config } = require("../database/connection");

async function obtenerDatosEstudiante(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT EstudianteId, Nombre,
                       ISNULL(Puntos, 0)       AS Puntos,
                       ISNULL(Racha, 0)        AS Racha,
                       FechaRegistro
                FROM Estudiantes
                WHERE EstudianteId = @estudianteId
            `);
        return resultado.recordset[0] || null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerInsignias() {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .query("SELECT * FROM Insignias ORDER BY InsigniaId");
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerNiveles() {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .query("SELECT * FROM Niveles ORDER BY NivelId");
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerDesafios() {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .query("SELECT * FROM Desafios ORDER BY DesafioId");
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerInsigniasEstudiante(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`SELECT InsigniaId FROM EstudianteInsignia WHERE EstudianteId = @estudianteId`);
        return resultado.recordset.map(r => r.InsigniaId);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerProgresoDesafios(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`SELECT DesafioId, Progreso, Completado FROM ProgresoDesafio WHERE EstudianteId = @estudianteId`);
        const mapa = {};
        resultado.recordset.forEach(r => {
            mapa[r.DesafioId] = { progreso: r.Progreso, completado: !!r.Completado };
        });
        return mapa;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function actualizarProgresoDesafio(estudianteId, desafioId, progreso) {
    try {
        const pool = await sql.connect(config);
        const existe = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("desafioId",   sql.Int, desafioId)
            .query(`SELECT Id FROM ProgresoDesafio WHERE EstudianteId = @estudianteId AND DesafioId = @desafioId`);

        if (existe.recordset.length > 0) {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("desafioId",   sql.Int, desafioId)
                .input("progreso",    sql.Int, progreso)
                .query(`
                    UPDATE ProgresoDesafio
                    SET Progreso = @progreso,
                        Completado = CASE WHEN @progreso >= (SELECT Objetivo FROM Desafios WHERE DesafioId = @desafioId) THEN 1 ELSE 0 END
                    WHERE EstudianteId = @estudianteId AND DesafioId = @desafioId
                `);
        } else {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("desafioId",   sql.Int, desafioId)
                .input("progreso",    sql.Int, progreso)
                .query(`
                    INSERT INTO ProgresoDesafio (EstudianteId, DesafioId, Progreso, Completado)
                    VALUES (@estudianteId, @desafioId, @progreso, 0)
                `);
        }
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function agregarPuntos(estudianteId, puntos) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("puntos", sql.Int, puntos)
            .query(`UPDATE Estudiantes SET Puntos = ISNULL(Puntos, 0) + @puntos WHERE EstudianteId = @estudianteId`);
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function otorgarInsignia(estudianteId, insigniaId) {
    try {
        const pool = await sql.connect(config);
        const existe = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("insigniaId",   sql.Int, insigniaId)
            .query(`SELECT Id FROM EstudianteInsignia WHERE EstudianteId = @estudianteId AND InsigniaId = @insigniaId`);

        if (existe.recordset.length === 0) {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("insigniaId",   sql.Int, insigniaId)
                .query(`INSERT INTO EstudianteInsignia (EstudianteId, InsigniaId, FechaObtencion) VALUES (@estudianteId, @insigniaId, CAST(GETDATE() AS DATE))`);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerCursosInscritosCount(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`SELECT COUNT(*) AS Total FROM EstudianteCurso WHERE EstudianteId = @estudianteId`);
        return resultado.recordset[0].Total;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Lecciones completadas en los últimos 7 días (para reto semanal)
async function obtenerLeccionesSemanalesCount(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT COUNT(*) AS Total FROM ProgresoLeccion
                WHERE EstudianteId = @estudianteId
                  AND Completado = 1
                  AND FechaCompletado >= DATEADD(DAY, -7, GETDATE())
            `);
        return resultado.recordset[0].Total;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Incrementa el progreso de un desafío en +delta (sin sobrepasar Objetivo)
async function incrementarProgresoDesafio(estudianteId, desafioId, delta) {
    try {
        const pool = await sql.connect(config);
        const existe = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("desafioId",   sql.Int, desafioId)
            .query(`SELECT Id, Progreso FROM ProgresoDesafio WHERE EstudianteId = @estudianteId AND DesafioId = @desafioId`);

        if (existe.recordset.length > 0) {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("desafioId",   sql.Int, desafioId)
                .input("delta",       sql.Int, delta)
                .query(`
                    UPDATE ProgresoDesafio
                    SET Progreso = LEAST(Progreso + @delta, (SELECT Objetivo FROM Desafios WHERE DesafioId = @desafioId)),
                        Completado = CASE
                            WHEN Progreso + @delta >= (SELECT Objetivo FROM Desafios WHERE DesafioId = @desafioId) THEN 1
                            ELSE 0
                        END
                    WHERE EstudianteId = @estudianteId AND DesafioId = @desafioId
                `);
        } else {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("desafioId",   sql.Int, desafioId)
                .input("delta",       sql.Int, delta)
                .query(`
                    INSERT INTO ProgresoDesafio (EstudianteId, DesafioId, Progreso, Completado)
                    VALUES (@estudianteId, @desafioId,
                        LEAST(@delta, (SELECT Objetivo FROM Desafios WHERE DesafioId = @desafioId)), 0)
                `);
        }
        // Devuelve progreso actualizado y si se completó
        const actual = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("desafioId",   sql.Int, desafioId)
            .query(`SELECT Progreso, Completado FROM ProgresoDesafio WHERE EstudianteId = @estudianteId AND DesafioId = @desafioId`);
        return actual.recordset[0] || { Progreso: 0, Completado: 0 };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    obtenerDatosEstudiante,
    obtenerInsignias,
    obtenerNiveles,
    obtenerDesafios,
    obtenerInsigniasEstudiante,
    obtenerProgresoDesafios,
    actualizarProgresoDesafio,
    incrementarProgresoDesafio,
    agregarPuntos,
    otorgarInsignia,
    obtenerCursosInscritosCount,
    obtenerLeccionesSemanalesCount
};
