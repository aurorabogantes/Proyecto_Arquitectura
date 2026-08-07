import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchUser } from "../services/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const { user: authUser, token } = useAuth();
    const [user, setUser]           = useState(null);
    const [gamificationTick, setGamificationTick] = useState(0);

    const studentId = authUser?.estudianteId || null;

    // Call this anywhere to signal the GamificationPage to refresh immediately
    const notifyGamificationUpdate = useCallback(() => setGamificationTick(n => n + 1), []);

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
        <UserContext.Provider value={{ user, setUser, studentId, gamificationTick, notifyGamificationUpdate }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
