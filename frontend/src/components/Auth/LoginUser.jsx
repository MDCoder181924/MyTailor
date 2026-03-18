import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUser = ({  onSwitch, identity }) => {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const res = await fetch(`${apiBaseUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail,
          userPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login Success ");

        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        alert(data.message);
      }

    } catch (err) {
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} id="customer-login" className="space-y-4 mt-4" >
      <h3 className="text-xl text-white font-medium text-center">Customer Login</h3>
      <p className="text-sm text-gray-400 text-center">Welcome back! Please login to your account.</p>

      <div>
        <label htmlFor="c-login-id" className="text-xs uppercase text-gray-400 font-semibold">Email</label>
        <input
          value={userEmail}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="email" id="c-login-id" placeholder="Enter your email or name" required />
      </div>

      <div>
        <label htmlFor="c-login-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input
          value={userPassword}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="password" id="c-login-pass" placeholder="Enter your password" required />
      </div>

      <button 
      disabled={isSubmitting}
      type="submit" className={`w-full py-3 rounded-md font-bold ${identity === 'customer' ? 'bg-yellow-400 text-black' : 'bg-teal-400 text-black'}`}>{isSubmitting ? "Logging in..." : "Login"}</button>

      <div className="text-center text-sm text-gray-400">
        <p>Don't have an account? <span className="text-yellow-400 font-semibold cursor-pointer" onClick={() => onSwitch('signup')}>Sign Up</span></p>
      </div>
    </form>
  )
}

export default LoginUser
