import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

export default function Navbar() {
    const { user } = useUser();
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();

    const esStaff = authUser?.rol === 'docente' || authUser?.rol === 'administrador';

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg kodkids-navbar">
            <div className="container">
                <NavLink className="navbar-brand fw-bold text-white fs-4 text-decoration-none" to="/">
                                <i className="bi bi-rocket-fill" style={{fontSize:'1.2rem'}} /> KodKids
                </NavLink>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMain"
                    aria-controls="navbarMain"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
                        {authUser && !esStaff && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link text-white fw-semibold px-3 py-2 rounded" to="/courses">
                                        <><Icon name="image" /> Cursos</>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link text-white fw-semibold px-3 py-2 rounded" to="/gamification">
                                        <><Icon name="trophy" /> Gamificación</>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {authUser && esStaff && (
                            <li className="nav-item">
                                <NavLink className="nav-link text-white fw-semibold px-3 py-2 rounded" to="/reports">
                                    <><Icon name="file" /> Reportes</>
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center ms-3 gap-2">
                        {user && (
                            <span className="badge bg-warning text-dark py-2 px-3 rounded-pill fw-bold">
                                <Icon name="star" /> {user.Puntos ?? 0} pts
                            </span>
                        )}

                        {authUser && (
                            <span className="text-white fw-semibold small d-flex align-items-center">
                                <i className="bi bi-person-circle me-2" style={{fontSize:'.95rem'}} /> {authUser.nombre}
                            </span>
                        )}

                        {authUser ? (
                            <button className="btn btn-sm btn-outline-light" onClick={onLogout}>
                                Salir
                            </button>
                        ) : (
                            <>
                                <NavLink className="btn btn-sm btn-outline-light" to="/login">Ingresar</NavLink>
                                <NavLink className="btn btn-sm btn-light" to="/register">Registrarse</NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
