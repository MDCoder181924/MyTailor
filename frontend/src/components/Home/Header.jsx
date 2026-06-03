import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="relative z-50 bg-black/40 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl text-amber-400 font-serif font-semibold tracking-wide">
              MyTailor
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-gray-300 hover:text-amber-400 text-lg transition duration-200">
              Explore
            </Link>
            <Link to="/Artisans" className="text-gray-300 hover:text-amber-400 text-lg transition duration-200">
              Tailors
            </Link>
            <a href="#journey" className="text-gray-300 hover:text-amber-400 text-lg transition duration-200">
              How it Works
            </a>
            <Link to="/auth" className="bg-amber-400 text-black px-6 py-2 rounded-3xl font-medium border-2 border-amber-400 hover:bg-transparent hover:text-amber-400 transition duration-300">
              Login / Sign Up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-400 hover:text-amber-400 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-lg border-b border-gray-900 transition-all duration-300 ease-in-out">
          <nav className="flex flex-col px-6 py-8 gap-6">
            <Link
              to="/explore"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-amber-400 text-xl font-medium transition duration-200"
            >
              Explore
            </Link>
            <Link
              to="/Artisans"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-amber-400 text-xl font-medium transition duration-200"
            >
              Tailors
            </Link>
            <a
              href="#journey"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-amber-400 text-xl font-medium transition duration-200"
            >
              How it Works
            </a>
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-amber-400 text-black px-6 py-3 rounded-3xl font-semibold border-2 border-amber-400 hover:bg-transparent hover:text-amber-400 transition duration-300 mt-2"
            >
              Login / Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

