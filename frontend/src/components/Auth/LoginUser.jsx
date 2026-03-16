import React from 'react'

const LoginUser = ({ onSubmit, onSwitch, identity }) => {
  return (
    <form id="customer-login" className="space-y-4 mt-4" onSubmit={onSubmit}>
      <h3 className="text-xl text-white font-medium text-center">Customer Login</h3>
      <p className="text-sm text-gray-400 text-center">Welcome back! Please login to your account.</p>

      <div>
        <label htmlFor="c-login-id" className="text-xs uppercase text-gray-400 font-semibold">Email or Name</label>
        <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="text" id="c-login-id" placeholder="Enter your email or name" required />
      </div>

      <div>
        <label htmlFor="c-login-pass" className="text-xs uppercase text-gray-400 font-semibold">Password</label>
        <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400" type="password" id="c-login-pass" placeholder="Enter your password" required />
      </div>

      <button type="submit" className={`w-full py-3 rounded-md font-bold ${identity==='customer'? 'bg-yellow-400 text-black' : 'bg-teal-400 text-black'}`}>Login</button>

      <div className="text-center text-sm text-gray-400">
        <p>Don't have an account? <span className="text-yellow-400 font-semibold cursor-pointer" onClick={() => onSwitch('signup')}>Sign Up</span></p>
      </div>
    </form>
  )
}

export default LoginUser
