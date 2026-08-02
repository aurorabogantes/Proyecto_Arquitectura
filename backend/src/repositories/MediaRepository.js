const { sql, config } = require("../database/connection");

async function obtenerMediaItems(tipo) {
    try {
        const pool = await sql.connect(config);
        const req = pool.request();
        let query = `
            SELECT m.MediaId, m.Tipo, m.Url, m.Titulo,
                   m.CursoId, c.Titulo AS TituloCurso
            FROM MediaItems m
            LEFT JOIN Cursos c ON c.CursoId = m.CursoId
        `;
        if (tipo) {
            query += " WHERE m.Tipo = @tipo";
            req.input("tipo", sql.NVarChar(50), tipo);
        }
        query += " ORDER BY m.MediaId";
        const resultado = await req.query(query);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function obtenerMediaPorCurso(cursoId) {
    try {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("cursoId", sql.Int, cursoId)
            .query(`
                SELECT MediaId, Tipo, Url, Titulo, CursoId
                FROM MediaItems
                WHERE CursoId = @cursoId
                ORDER BY MediaId
            `);
        return resultado.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { obtenerMediaItems, obtenerMediaPorCurso };
