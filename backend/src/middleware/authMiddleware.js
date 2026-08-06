const jwt = require("jsonwebtoken");

// En desarrollo cae a un secreto por defecto; en producción SIEMPRE
// se debe definir JWT_SECRET en el archivo .env (ver .env.example).
const JWT_SECRET = process.env.JWT_SECRET || "kodkids_dev_secret_change_me";

/**
 * Verifica el header "Authorization: Bearer <token>".
 * Si es válido, guarda el contenido del token en req.user:
 * { usuarioId, nombre, email, rol, estudianteId }
 */
function verificarToken(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = header.slice(7);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

/**
 * Debe usarse DESPUÉS de verificarToken.
 * Permite el paso solo si req.user.rol está en la lista dada.
 * Ejemplo: requireRole('docente', 'administrador')
 */
function requireRole(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: "No tienes permisos para acceder a este recurso" });
        }
        next();
    };
}

module.exports = { verificarToken, requireRole, JWT_SECRET };
