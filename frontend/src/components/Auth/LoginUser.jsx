import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const LoginUser = ({ onSwitch, identity }) => {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser, setTailor } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const res = await api.post("/api/user/login", {
        userEmail,
        userPassword
      });

      const data = res.data;

      toast.success(data.message || "Logged in successfully!");
      setUser(data.user);
      setTailor(null);
      localStorage.removeItem("tailor");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("accessToken");

      navigate("/deshboard");

    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed";
      toast.error(errMsg);
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

export default LoginUser;
