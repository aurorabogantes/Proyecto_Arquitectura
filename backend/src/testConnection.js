const { sql, config } = require("./database/connection");

async function testConnection() {
    try {
        const pool = await sql.connect(config);

        console.log("✅ Conectado correctamente a SQL Server");

        const result = await pool.request().query("SELECT * FROM Cursos");

        console.log(result.recordset);

        await sql.close();

    } catch (err) {
        console.error("❌ Error de conexión:");
        console.error(err);
    }
}

testConnection();