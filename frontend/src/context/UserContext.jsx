import { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "../services/api";

const UserContext = createContext(null);

// ID del estudiante activo (modo demo). Cambiar según el sistema de autenticación.
const DEFAULT_STUDENT_ID = 1;

export function UserProvider({ children }) {
    const [user, setUser]           = useState(null);
    const [studentId]               = useState(DEFAULT_STUDENT_ID);

    useEffect(() => {
        fetchUser(DEFAULT_STUDENT_ID)
            .then(data => { if (data?.user) setUser(data.user); })
            .catch(() => {});
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, studentId }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
