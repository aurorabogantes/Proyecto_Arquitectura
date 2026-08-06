const { sql, config } = require("../database/connection");

const userRepository = {

    async buscarPorEmail(email) {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("email", sql.VarChar, email)
            .query(`
                SELECT UsuarioId, Nombre, Email, PasswordHash, Rol, EstudianteId
                FROM Usuarios
                WHERE Email = @email
            `);
        return resultado.recordset[0] || null;
    },

    async buscarPorId(usuarioId) {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("usuarioId", sql.Int, usuarioId)
            .query(`
                SELECT UsuarioId, Nombre, Email, Rol, EstudianteId
                FROM Usuarios
                WHERE UsuarioId = @usuarioId
            `);
        return resultado.recordset[0] || null;
    },

    // Crea la fila del estudiante asociada a una cuenta nueva con rol 'estudiante'
    async crearEstudiante(nombre) {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .query(`
                INSERT INTO Estudiantes (Nombre, Avatar, FechaRegistro, Puntos, Racha)
                OUTPUT INSERTED.EstudianteId
                VALUES (@nombre, '🙂', CAST(GETDATE() AS DATE), 0, 0)
            `);
        return resultado.recordset[0].EstudianteId;
    },

    async crearUsuario({ nombre, email, passwordHash, rol, estudianteId }) {
        const pool = await sql.connect(config);
        const resultado = await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("email", sql.VarChar, email)
            .input("passwordHash", sql.VarChar, passwordHash)
            .input("rol", sql.VarChar, rol)
            .input("estudianteId", sql.Int, estudianteId)
            .query(`
                INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol, EstudianteId, FechaCreacion)
                OUTPUT INSERTED.UsuarioId
                VALUES (@nombre, @email, @passwordHash, @rol, @estudianteId, GETDATE())
            `);
        return resultado.recordset[0].UsuarioId;
    }

};

module.exports = userRepository;
