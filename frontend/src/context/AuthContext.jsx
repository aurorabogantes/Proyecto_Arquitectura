import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest, fetchMe } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'kodkids_token';

export function AuthProvider({ children }) {
    const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser]       = useState(null);
    const [cargando, setCargando] = useState(true);

    // Al cargar la app, si hay un token guardado, valida la sesión con el backend.
    useEffect(() => {
        if (!token) {
            setCargando(false);
            return;
        }
        fetchMe()
            .then(data => {
                if (data?.user) setUser(data.user);
                else throw new Error('Sesión inválida');
            })
            .catch(() => {
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setUser(null);
            })
            .finally(() => setCargando(false));
    }, [token]);

    const login = async (email, password) => {
        const data = await loginRequest(email, password);
        if (data.error) throw new Error(data.error);
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async ({ nombre, email, password, rol }) => {
        const data = await registerRequest({ nombre, email, password, rol });
        if (data.error) throw new Error(data.error);
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, cargando, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
