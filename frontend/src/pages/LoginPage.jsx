import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const user = await login(email, password);
            const esStaff = user.rol === 'docente' || user.rol === 'administrador';
            navigate(esStaff ? '/reports' : '/courses', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: 420 }}>
            <h2 className="fw-bold mb-4 text-center">Iniciar sesión</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary w-100" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>

            <p className="text-center mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
}
