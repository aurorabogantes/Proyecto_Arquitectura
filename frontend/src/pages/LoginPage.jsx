import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const user = await login(email, password);
            const esStaff =
                user.rol === 'docente' || user.rol === 'administrador';

            navigate(esStaff ? '/reports' : '/courses', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5">
            <div
                className="card border-0 shadow-sm mx-auto p-4"
                style={{
                    maxWidth: 420,
                    borderRadius: 18
                }}
            >
                <h2 className="fw-bold mb-4 text-center">
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Correo
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary-custom w-100 py-2"
                        disabled={cargando}
                    >
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
