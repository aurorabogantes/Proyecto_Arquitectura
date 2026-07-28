const sql = require("mssql");

const config = {
    user: "sa",
    password: "Admin1234!", // La contraseña que le asignaste a sa
    server: "DESKTOP-MD7MJ1N", // O "localhost"
    database: "InnovacionEducativa",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

module.exports = { sql, config };