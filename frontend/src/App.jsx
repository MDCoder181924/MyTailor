import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <AppRoutes />
                    <Toaster position="top-center" reverseOrder={false} />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
