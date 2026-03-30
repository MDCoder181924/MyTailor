import { createContext, useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

                const accountRes = await authFetch(`${apiBaseUrl}/api/auth/me`);

                if (accountRes.ok) {
                    const data = await accountRes.json();

                    if (data.role === "user") {
                        setUser(data.user);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        setTailor(null);
                        localStorage.removeItem("tailor");
                        return;
                    }

                    if (data.role === "tailor") {
                        setTailor(data.tailor);
                        localStorage.setItem("tailor", JSON.stringify(data.tailor));
                        setUser(null);
                        localStorage.removeItem("user");
                        return;
                    }
                }

                if (accountRes.status === 401 || accountRes.status === 403 || accountRes.status === 404) {
                    setUser(null);
                    setTailor(null);
                    localStorage.removeItem("user");
                    localStorage.removeItem("tailor");
                }

            } catch (err) {
                console.log("Auth check failed");
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
