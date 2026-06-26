import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

const readStoredAccount = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => readStoredAccount("user"));
    const [tailor, setTailor] = useState(() => readStoredAccount("tailor"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accountRes = await api.get("/api/auth/me");
                const data = accountRes.data;

                if (data.role === "user") {
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setTailor(null);
                    localStorage.removeItem("tailor");
                } else if (data.role === "tailor") {
                    setTailor(data.tailor);
                    localStorage.setItem("tailor", JSON.stringify(data.tailor));
                    setUser(null);
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.log("Auth check failed");
                const status = err.response?.status;
                if (status === 401 || status === 403 || status === 404) {
                    setUser(null);
                    setTailor(null);
                    localStorage.removeItem("user");
                    localStorage.removeItem("tailor");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, tailor, setTailor, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
