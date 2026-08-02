const { sql, config } = require("../database/connection");

async function obtenerDatosEstudiante(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                SELECT EstudianteId, Nombre,
                       ISNULL(Puntos, 0)  AS Puntos,
                       ISNULL(Racha, 0)   AS Racha,
                       FechaIngreso
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
            .query("SELECT * FROM Niveles ORDER BY Nivel");
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerRetos() {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .query("SELECT * FROM Retos ORDER BY RetoId");
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

async function obtenerProgresoRetos(estudianteId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .query(`SELECT RetoId, Progreso, Completado FROM EstudianteReto WHERE EstudianteId = @estudianteId`);
        const mapa = {};
        resultado.recordset.forEach(r => {
            mapa[r.RetoId] = { progreso: r.Progreso, completado: !!r.Completado };
        });
        return mapa;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function actualizarProgresoReto(estudianteId, retoId, progreso) {
    try {
        const pool = await sql.connect(config);
        const existe = await pool.request()
            .input("estudianteId", sql.Int, estudianteId)
            .input("retoId", sql.Int, retoId)
            .query(`SELECT Id FROM EstudianteReto WHERE EstudianteId = @estudianteId AND RetoId = @retoId`);

        if (existe.recordset.length > 0) {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("retoId", sql.Int, retoId)
                .input("progreso", sql.Int, progreso)
                .query(`
                    UPDATE EstudianteReto
                    SET Progreso = @progreso,
                        Completado = CASE WHEN @progreso >= (SELECT Meta FROM Retos WHERE RetoId = @retoId) THEN 1 ELSE 0 END
                    WHERE EstudianteId = @estudianteId AND RetoId = @retoId
                `);
        } else {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("retoId", sql.Int, retoId)
                .input("progreso", sql.Int, progreso)
                .query(`
                    INSERT INTO EstudianteReto (EstudianteId, RetoId, Progreso, Completado)
                    VALUES (@estudianteId, @retoId, @progreso, 0)
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
            .input("insigniaId", sql.Int, insigniaId)
            .query(`SELECT Id FROM EstudianteInsignia WHERE EstudianteId = @estudianteId AND InsigniaId = @insigniaId`);

        if (existe.recordset.length === 0) {
            await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .input("insigniaId", sql.Int, insigniaId)
                .query(`INSERT INTO EstudianteInsignia (EstudianteId, InsigniaId) VALUES (@estudianteId, @insigniaId)`);
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

module.exports = {
    obtenerDatosEstudiante,
    obtenerInsignias,
    obtenerNiveles,
    obtenerRetos,
    obtenerInsigniasEstudiante,
    obtenerProgresoRetos,
    actualizarProgresoReto,
    agregarPuntos,
    otorgarInsignia,
    obtenerCursosInscritosCount
};
