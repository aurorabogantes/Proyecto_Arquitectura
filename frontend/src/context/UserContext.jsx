import { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "../services/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const { user: authUser, token } = useAuth();
    const [user, setUser]           = useState(null);

    // El estudiante activo es el vinculado a la cuenta que inició sesión.
    const studentId = authUser?.estudianteId || null;

    useEffect(() => {
        if (!token || !studentId) {
            setUser(null);
            return;
        }
        fetchUser()
            .then(data => { if (data?.user) setUser(data.user); })
            .catch(() => {});
    }, [token, studentId]);

    return (
        <UserContext.Provider value={{ user, setUser, studentId }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
