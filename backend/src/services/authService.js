const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/UserRepository");
const { JWT_SECRET } = require("../middleware/authMiddleware");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRA = "8h";

// Un usuario solo puede auto-registrarse como estudiante o docente.
// El rol 'administrador' se asigna manualmente en la base de datos
// para evitar que cualquiera se otorgue permisos de administrador.
const ROLES_AUTOREGISTRO = ["estudiante", "docente"];

class AuthService {

    async register({ nombre, email, password, rol }) {
        if (!nombre || !email || !password) {
            throw new Error("Nombre, correo y contraseña son requeridos");
        }
        if (password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        const emailNormalizado = String(email).trim().toLowerCase();
        const rolFinal = ROLES_AUTOREGISTRO.includes(rol) ? rol : "estudiante";

        const existente = await userRepository.buscarPorEmail(emailNormalizado);
        if (existente) {
            throw new Error("Ya existe una cuenta con ese correo");
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Si se registra como estudiante, también se crea su fila en
        // Estudiantes para que pueda inscribirse en cursos y sumar puntos.
        let estudianteId = null;
        if (rolFinal === "estudiante") {
            estudianteId = await userRepository.crearEstudiante(nombre.trim());
        }

        const usuarioId = await userRepository.crearUsuario({
            nombre: nombre.trim(),
            email: emailNormalizado,
            passwordHash,
            rol: rolFinal,
            estudianteId
        });

        return this._generarSesion({ usuarioId, nombre: nombre.trim(), email: emailNormalizado, rol: rolFinal, estudianteId });
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error("Correo y contraseña son requeridos");
        }

        const emailNormalizado = String(email).trim().toLowerCase();
        const usuario = await userRepository.buscarPorEmail(emailNormalizado);
        if (!usuario) {
            throw new Error("Credenciales inválidas");
        }

        const passwordValida = await bcrypt.compare(password, usuario.PasswordHash);
        if (!passwordValida) {
            throw new Error("Credenciales inválidas");
        }

        return this._generarSesion({
            usuarioId: usuario.UsuarioId,
            nombre: usuario.Nombre,
            email: usuario.Email,
            rol: usuario.Rol,
            estudianteId: usuario.EstudianteId
        });
    }

    _generarSesion(payload) {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRA });
        return { token, user: payload };
    }
}

module.exports = new AuthService();
