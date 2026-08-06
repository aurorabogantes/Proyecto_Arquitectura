const { sql, config } = require("../database/connection");

const userController = {

    // GET /api/user/current  (requiere token; usa el estudiante de la sesión activa)
    async current(req, res) {
        try {
            const estudianteId = req.user.estudianteId;
            if (!estudianteId) {
                return res.status(400).json({ error: 'Esta cuenta no tiene un perfil de estudiante asociado' });
            }

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
    },

    // GET /api/user/students  (solo docente/administrador; para elegir a quién reportar)
    async listStudents(req, res) {
        try {
            const pool = await sql.connect(config);
            const resultado = await pool.request().query(`
                SELECT EstudianteId, Nombre, ISNULL(Puntos, 0) AS Puntos
                FROM Estudiantes
                ORDER BY Nombre
            `);
            res.json({ estudiantes: resultado.recordset });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;
