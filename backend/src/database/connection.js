const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={SQL Server};Server=DESKTOP-MD7MJ1N;Database=InnovacionEducativa;Trusted_Connection=yes;TrustServerCertificate=yes;"
};

module.exports = { sql, config };