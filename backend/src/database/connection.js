const sql = require("mssql");

const config = {
    user: "sa",
    password: "Admin1234!",
    server: "KEVINAGP_PC\\SQL2022",
    database: "InnovacionEducativa",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

module.exports = { sql, config };