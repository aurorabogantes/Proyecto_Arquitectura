const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={SQL Server};Server=AURORAPC\\SQL2022;Database=InnovacionEducativa;Trusted_Connection=yes;TrustServerCertificate=yes;"
};

module.exports = { sql, config };