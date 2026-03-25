import { createContext, useState } from "react";

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const [tailor, setTailor] = useState(
        JSON.parse(localStorage.getItem("tailor")) || null
    );

    return (
        <AuthContext.Provider value={{ user, setUser, tailor, setTailor }}>
            {children}
        </AuthContext.Provider>
    );
};