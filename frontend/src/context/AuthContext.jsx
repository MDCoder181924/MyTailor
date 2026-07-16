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
    const [admin, setAdmin] = useState(() => readStoredAccount("admin"));
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
                    setAdmin(null);
                    localStorage.removeItem("admin");
                } else if (data.role === "tailor") {
                    setTailor(data.tailor);
                    localStorage.setItem("tailor", JSON.stringify(data.tailor));
                    setUser(null);
                    localStorage.removeItem("user");
                    setAdmin(null);
                    localStorage.removeItem("admin");
                } else if (data.role === "admin") {
                    setAdmin(data.admin);
                    localStorage.setItem("admin", JSON.stringify(data.admin));
                    setUser(null);
                    localStorage.removeItem("user");
                    setTailor(null);
                    localStorage.removeItem("tailor");
                }
            } catch (err) {
                console.log("Auth check failed");
                const status = err.response?.status;
                if (status === 401 || status === 403 || status === 404) {
                    setUser(null);
                    setTailor(null);
                    setAdmin(null);
                    localStorage.removeItem("user");
                    localStorage.removeItem("tailor");
                    localStorage.removeItem("admin");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const handleLogoutEvent = () => {
            setUser(null);
            setTailor(null);
            setAdmin(null);
            localStorage.removeItem("user");
            localStorage.removeItem("tailor");
            localStorage.removeItem("admin");
        };

        window.addEventListener("auth-logout", handleLogoutEvent);
        return () => {
            window.removeEventListener("auth-logout", handleLogoutEvent);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, tailor, setTailor, admin, setAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
