const { sql, config } = require("../database/connection");

const userController = {
    async current(req, res) {
        try {
            const estudianteId = parseInt(req.query.estudianteId) || 1;
            const pool = await sql.connect(config);
            const resultado = await pool.request()
                .input("estudianteId", sql.Int, estudianteId)
                .query(`
                    SELECT EstudianteId, Nombre,
                           ISNULL(Puntos, 0) AS Puntos,
                           ISNULL(Racha, 0)  AS Racha
                    FROM Estudiantes
                    WHERE EstudianteId = @estudianteId
                `);
            if (resultado.recordset.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ user: resultado.recordset[0] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;
