import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginUser from '../components/Auth/LoginUser';
import SignupUser from '../components/Auth/SignupUser';
import LoginTailor from '../components/Auth/LoginTailor';
import SignupTailor from '../components/Auth/SignupTailor';

const Auth = () => {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState('customer'); // customer | tailor
    const [activeForm, setActiveForm] = useState('login'); // login | signup

    useEffect(() => {
        document.body.setAttribute('data-theme', identity);
        return () => {
            document.body.removeAttribute('data-theme');
        }
    }, [identity]);

    const handleIdentitySwitch = (type) => {
        setIdentity(type);
        setActiveForm('login'); // Reset to login when switching identity
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        // Basic Password Match Validation
        const passInput = form.querySelector('input[type="password"]:not([id$="-confirm"])');
        const confirmInput = form.querySelector('input[id$="-confirm"]');

        if (confirmInput && passInput) {
            if (passInput.value !== confirmInput.value) {
                alert("Passwords do not match!");
                return;
            }
        }

        // Demo Success Logic
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.innerText = 'Processing...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.innerText = 'Success!';
            btn.style.background = '#4CAF50';
            btn.style.color = '#fff';

            setTimeout(() => {
                alert(`Successfully submitted!`);
                btn.innerText = originalText;
                btn.style.background = ''; // reset to CSS default
                btn.style.opacity = '1';

                // If login, redirect to home
                if (activeForm === 'login') {
                    navigate('/');
                }
            }, 1000);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute -top-16 -left-10 w-48 h-48 rounded-full bg-yellow-400 opacity-10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-10 w-56 h-56 rounded-full bg-teal-400 opacity-8 blur-3xl pointer-events-none"></div>

            <div className="relative w-full max-w-md bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                    <Link to="/" className="text-sm text-gray-400 hover:text-yellow-400 inline-block mb-2">← Back to Home</Link>
                    <h2 className="text-2xl font-serif text-white uppercase tracking-wider">E-Tailoring</h2>
                    <div className="mt-4 flex rounded-full bg-white/5 p-1 border border-white/10">
                        <button
                            className={`flex-1 text-sm font-semibold py-2 rounded-full ${identity === 'customer' ? 'bg-yellow-400 text-black shadow' : 'text-gray-300'}`}
                            onClick={() => handleIdentitySwitch('customer')}
                        >
                            Customer
                        </button>
                        <button
                            className={`flex-1 text-sm font-semibold py-2 rounded-full ${identity === 'tailor' ? 'bg-teal-400 text-black shadow' : 'text-gray-300'}`}
                            onClick={() => handleIdentitySwitch('tailor')}
                        >
                            Tailor
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {identity === 'customer' && (
                        <>
                            {activeForm === 'login' ? (
                                <LoginUser onSubmit={handleFormSubmit} onSwitch={setActiveForm} identity={identity} />
                            ) : (
                                <SignupUser onSubmit={handleFormSubmit} onSwitch={setActiveForm} identity={identity} />
                            )}
                        </>
                    )}

                    {identity === 'tailor' && (
                        <>
                            {activeForm === 'login' ? (
                                <LoginTailor onSubmit={handleFormSubmit} onSwitch={setActiveForm} identity={identity} />
                            ) : (
                                <SignupTailor onSubmit={handleFormSubmit} onSwitch={setActiveForm} identity={identity} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
