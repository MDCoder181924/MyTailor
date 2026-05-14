import React, { useState } from 'react';

const SignupUser = ({  onSwitch, identity }) => {
  const [userFullName, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [userPassword1, setPassword1] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location && window.location.hostname && window.location.hostname.includes("vercel.app") ? "https://my-tailor-backend.vercel.app" : "http://localhost:5000");

  const onSubmitUserSignUp = async (e) => {

    e.preventDefault();
    if (userPassword !== userPassword1) {
      alert("Password not match");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${apiBaseUrl}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userFullName: userFullName.trim(),
          userEmail: userEmail.trim(),
          userPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Signup Success");
        setEmail("");
        setName("");
        setPassword("");
        setPassword1("");
        onSwitch("login");
      }
      else {
        alert(data.message || data.error || "Signup failed");
      }
    }
    catch (error) {
      alert("Server sathe connect thai shakyu nathi. Backend chalu chhe ke nai te check karo.");
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form id="customer-signup" className="space-y-4 mt-4" onSubmit={onSubmitUserSignUp}>
      <h3 className="text-xl text-white font-medium text-center">Customer Sign Up</h3>
      <p className="text-sm text-gray-400 text-center">Create an account to order custom designs.</p>

      <div>
        <label htmlFor="c-signup-name" className="text-xs uppercase text-gray-400 font-semibold">Full Name</label>
        <input
          type="text"
          value={userFullName}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" id="c-signup-name" placeholder="Enter your full name" required />
      </div>

      <div>
        <label htmlFor="c-signup-email" className="text-xs uppercase text-gray-400 font-semibold">Email Address</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" id="c-signup-email" placeholder="Enter your email" required />
      </div>

      <div>
        <label htmlFor="c-signup-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input type="password"
          value={userPassword}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" id="c-signup-pass" placeholder="Create a password" required />
      </div>

      <div>
        <label htmlFor="c-signup-confirm" className="text-xs uppercase text-gray-400 font-semibold">Confirm Password</label>
        <input
          type="password"
          value={userPassword1}
          onChange={(e) => setPassword1(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" id="c-signup-confirm" placeholder="Confirm your password" required />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-md font-bold ${identity === 'customer' ? 'bg-yellow-400 text-black' : 'bg-teal-400 text-black'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </button>

      <div className="text-center text-sm text-gray-400">
        <p>Already have an account? <span className="text-yellow-400 font-semibold cursor-pointer" onClick={() => onSwitch('login')}>Login</span></p>
      </div>
    </form>
  )
}

export default SignupUser
