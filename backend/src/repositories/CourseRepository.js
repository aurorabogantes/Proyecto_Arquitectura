const { sql, config } = require("../database/connection");

async function obtenerCursos() {

    try {

        const pool = await sql.connect(config);

        const resultado = await pool.request()
            .query("SELECT * FROM Cursos");

        return resultado.recordset;

    } catch (error) {

        console.log(error);

    }

}

module.exports = {

    obtenerCursos

};