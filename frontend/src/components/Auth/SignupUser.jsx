import React from 'react'

const SignupUser = ({ onSubmit, onSwitch, identity }) => {
  return (
    <form id="customer-signup" className="space-y-4 mt-4" onSubmit={onSubmit}>
      <h3 className="text-xl text-white font-medium text-center">Customer Sign Up</h3>
      <p className="text-sm text-gray-400 text-center">Create an account to order custom designs.</p>

      <div>
        <label htmlFor="c-signup-name" className="text-xs uppercase text-gray-400 font-semibold">Full Name</label>
        <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="text" id="c-signup-name" placeholder="Enter your full name" required />
      </div>

      <div>
        <label htmlFor="c-signup-email" className="text-xs uppercase text-gray-400 font-semibold">Email Address</label>
        <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="email" id="c-signup-email" placeholder="Enter your email" required />
      </div>

      <div>
        <label htmlFor="c-signup-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="password" id="c-signup-pass" placeholder="Create a password" required />
      </div>

      <div>
        <label htmlFor="c-signup-confirm" className="text-xs uppercase text-gray-400 font-semibold">Confirm Password</label>
        <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="password" id="c-signup-confirm" placeholder="Confirm your password" required />
      </div>

      <button type="submit" className={`w-full py-3 rounded-md font-bold ${identity==='customer'? 'bg-yellow-400 text-black' : 'bg-teal-400 text-black'}`}>Sign Up</button>

      <div className="text-center text-sm text-gray-400">
        <p>Already have an account? <span className="text-yellow-400 font-semibold cursor-pointer" onClick={() => onSwitch('login')}>Login</span></p>
      </div>
    </form>
  )
}

export default SignupUser
