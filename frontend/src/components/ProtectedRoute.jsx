import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Envuelve una página y exige sesión iniciada. Si se pasa
// rolesPermitidos, además exige que el rol del usuario esté en esa lista.
export default function ProtectedRoute({ children, rolesPermitidos }) {
    const { token, user, cargando } = useAuth();

    if (cargando) {
        return <div className="text-center py-5">Cargando...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(user?.rol)) {
        return <Navigate to="/courses" replace />;
    }

    return children;
}
