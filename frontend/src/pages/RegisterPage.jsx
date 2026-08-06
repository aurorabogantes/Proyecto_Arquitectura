import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({
        nombre: '', email: '', password: '', confirmar: '', rol: 'estudiante'
    });
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setCargando(true);
        try {
            const user = await register({
                nombre: form.nombre,
                email: form.email,
                password: form.password,
                rol: form.rol
            });
            navigate(user.rol === 'docente' ? '/reports' : '/courses', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: 460 }}>
            <h2 className="fw-bold mb-4 text-center">Crear cuenta</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                        name="nombre"
                        className="form-control"
                        value={form.nombre}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={form.password}
                        onChange={onChange}
                        minLength={6}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar contraseña</label>
                    <input
                        type="password"
                        name="confirmar"
                        className="form-control"
                        value={form.confirmar}
                        onChange={onChange}
                        minLength={6}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label">Tipo de cuenta</label>
                    <select name="rol" className="form-select" value={form.rol} onChange={onChange}>
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                    </select>
                    <div className="form-text">
                        Los docentes tienen acceso a los reportes de desempeño de los estudiantes.
                    </div>
                </div>
                <button className="btn btn-primary w-100" disabled={cargando}>
                    {cargando ? 'Creando cuenta...' : 'Registrarme'}
                </button>
            </form>

            <p className="text-center mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </div>
    );
}
