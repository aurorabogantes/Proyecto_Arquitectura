import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }){
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/user')
            .then(r => r.json())
            .then(data => setUser(data.user))
            .catch(() => {});
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);