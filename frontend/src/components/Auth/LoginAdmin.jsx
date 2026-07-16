import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const LoginAdmin = ({ identity }) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setAdmin, setUser, setTailor } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post("/api/admin/login", {
        adminEmail,
        adminPassword,
      });
      const data = res.data;
      toast.success(data.message || "Admin logged in!");
      setAdmin(data.admin);
      setUser(null);
      setTailor(null);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.removeItem("user");
      localStorage.removeItem("tailor");
      localStorage.removeItem("accessToken");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} id="admin-login" className="space-y-4 mt-4">
      <h3 className="text-xl text-white font-medium text-center">Admin Login</h3>
      <p className="text-sm text-gray-400 text-center">Secure admin access portal.</p>

      <div>
        <label htmlFor="a-login-id" className="text-xs uppercase text-gray-400 font-semibold">Email</label>
        <input
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          type="email"
          id="a-login-id"
          placeholder="Enter admin email"
          required
        />
      </div>

      <div>
        <label htmlFor="a-login-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          type="password"
          id="a-login-pass"
          placeholder="Enter admin password"
          required
        />
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full py-3 rounded-md font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Authenticating..." : "Admin Login"}
      </button>
    </form>
  );
};

export default LoginAdmin;
