import React from 'react'

const Footer = () => {
  return (
    <footer className="py-8">
      <div className="max-w-5xl mx-auto px-6 text-center text-gray-400">
        <p>© {new Date().getFullYear()} E-Tailoring — All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
