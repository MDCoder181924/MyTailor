import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginUser from '../components/Auth/LoginUser';
import SignupUser from '../components/Auth/SignupUser';
import LoginTailor from '../components/Auth/LoginTailor';
import SignupTailor from '../components/Auth/SignupTailor';

const Auth = () => {


     const navigate = useNavigate();
    const [identity, setIdentity] = useState('customer');
    const [activeForm, setActiveForm] = useState('login');

    const handleIdentitySwitch = (type) => {
        setIdentity(type);
        setActiveForm('login');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
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
                            type="button"
                            className={`flex-1 text-sm font-semibold py-2 rounded-full ${identity === 'customer' ? 'bg-yellow-400 text-black shadow' : 'text-gray-300'}`}
                            onClick={() => handleIdentitySwitch('customer')}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
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
