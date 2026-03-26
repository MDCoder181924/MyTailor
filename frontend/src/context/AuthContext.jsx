import { createContext, useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const [tailor, setTailor] = useState(
        JSON.parse(localStorage.getItem("tailor")) || null
    );

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

                const userRes = await authFetch(`${apiBaseUrl}/api/user/profile`);

                if (userRes.ok) {
                    const data = await userRes.json();
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setTailor(null);
                    localStorage.removeItem("tailor");
                    return;
                }

                const tailorRes = await authFetch(`${apiBaseUrl}/api/tailor/profile`);

                if (tailorRes.ok) {
                    const data = await tailorRes.json();
                    setTailor(data.tailor);
                    localStorage.setItem("tailor", JSON.stringify(data.tailor));
                    setUser(null);
                    localStorage.removeItem("user");
                    return;
                }

                setUser(null);
                setTailor(null);
                localStorage.removeItem("user");
                localStorage.removeItem("tailor");

            } catch (err) {
                console.log("Auth check failed");
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, tailor, setTailor }}>
            {children}
        </AuthContext.Provider>
    );
};