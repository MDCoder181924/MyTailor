import React, { useState } from 'react'

const SignupTailor = ({  onSwitch, identity }) => {
    const [tailorName, setName] = useState("");
    const [tailorEmail, setEmail] = useState("");
    const [tailorMobileNumber, setPhoneNumber] = useState("");
    const [tailorPassword, setPassword] = useState("");
    const [tailorPassword1, setPassword1] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const onSubmitTailorSignup = async (e) => {
      e.preventDefault();

      const normalizedEmail = tailorEmail.trim().toLowerCase();
      const normalizedMobile = tailorMobileNumber.replace(/\D/g, "");

      if (!tailorName.trim() || !normalizedEmail || !normalizedMobile || !tailorPassword) {
        alert("Badha fields bharva jaruri chhe.");
        return;
      }

      if (normalizedMobile.length < 10) {
        alert("Valid mobile number enter karo.");
        return;
      }

      if (tailorPassword !== tailorPassword1) {
        alert("Password not match");
        return;
      }

      try {
        setIsSubmitting(true);

        const res = await fetch(`${apiBaseUrl}/api/tailor/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tailorName: tailorName.trim(),
            tailorEmail: normalizedEmail,
            tailorMobileNumber: normalizedMobile,
            tailorPassword
          })
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Tailor signup success");
          setName("");
          setEmail("");
          setPhoneNumber("");
          setPassword("");
          setPassword1("");
          onSwitch("login");
        } else {
          alert(data.message || "Tailor signup failed");
        }
      } catch (error) {
        alert("Server sathe connect thai shakyu nathi. Backend chalu chhe ke nai te check karo.");
      } finally {
        setIsSubmitting(false);
      }
    };


  return (
    <form id="tailor-signup" className="space-y-4 mt-4" onSubmit={onSubmitTailorSignup}>
      <h3 className="text-xl text-white font-medium text-center">Tailor Registration</h3>
      <p className="text-sm text-gray-400 text-center">Join our network of master tailors.</p>

      <div>
        <label htmlFor="t-signup-name" className="text-xs uppercase text-gray-400 font-semibold">Full Name</label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400"
          type="text"
          id="t-signup-name"
          value={tailorName}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="t-signup-email" className="text-xs uppercase text-gray-400 font-semibold">Email Address</label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400"
          type="email"
          id="t-signup-email"
          value={tailorEmail}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label htmlFor="t-signup-mobile" className="text-xs uppercase text-gray-400 font-semibold">Mobile Number</label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400"
          type="tel"
          id="t-signup-mobile"
          value={tailorMobileNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your 10 digit mobile number"
          required
        />
      </div>

      <div>
        <label htmlFor="t-signup-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400"
          type="password"
          id="t-signup-pass"
          value={tailorPassword}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          required
        />
      </div>

      <div>
        <label htmlFor="t-signup-confirm" className="text-xs uppercase text-gray-400 font-semibold">Confirm Password</label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400"
          type="password"
          id="t-signup-confirm"
          value={tailorPassword1}
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-md font-bold ${identity==='customer'? 'bg-yellow-400 text-black' : 'bg-teal-400 text-black'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Registering...' : 'Register Now'}
      </button>

      <div className="text-center text-sm text-gray-400">
        <p>Already registered? <span className="text-yellow-400 font-semibold cursor-pointer" onClick={() => onSwitch('login')}>Login</span></p>
      </div>
    </form>
  )
}

export default SignupTailor
