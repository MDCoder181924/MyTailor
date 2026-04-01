import React, { useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const LoginTailor = ({  onSwitch, identity }) => {
  
  const [tailorEmail, setEmail] = useState("");
  const [tailorPassword, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const {setTailor , setUser} = useContext(AuthContext);

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const res = await fetch(`${apiBaseUrl}/api/tailor/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tailorEmail: tailorEmail.trim().toLowerCase(),
          tailorPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setTailor(data.tailor)
        setUser(null)
        localStorage.setItem("tailor", JSON.stringify(data.tailor));
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken");

        navigate("/tailordahboard");
      } else {
        alert(data.message || "Tailor login failed");
      }

    } catch (err) {
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form id="tailor-login" className="space-y-4 mt-4" onSubmit={handleLogin}>
      <h3 className="text-xl text-white font-medium text-center">Tailor Login</h3>
      <p className="text-sm text-gray-400 text-center">Access your dashboard and manage orders.</p>

      <div>
        <label htmlFor="t-login-id" className="text-xs uppercase text-gray-400 font-semibold">Email</label>
        <input
          value={tailorEmail}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400" type="email" id="t-login-id" placeholder="Enter your email or name" required />
      </div>

      <div>
        <label htmlFor="t-login-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input
          value={tailorPassword}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400" type="password" id="t-login-pass" placeholder="Enter your password" required />
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className={`w-full py-3 rounded-md font-bold ${identity === 'customer' ? 'bg-yellow-400 text-black' : 'bg-teal-400 text-black'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <div className="text-center text-sm text-gray-400">
        <p>New to E-Tailoring? <span className="text-yellow-400 font-semibold cursor-pointer" onClick={() => onSwitch('signup')}>Join as Tailor</span></p>
      </div>
    </form>
  )
}

export default LoginTailor
