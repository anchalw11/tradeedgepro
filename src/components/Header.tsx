import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <TrendingUp className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              FundedFlow Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-400' 
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/membership" 
              className={`font-medium transition-colors ${
                isActive('/membership') 
                  ? 'text-blue-400' 
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              Pricing
            </Link>
            <a 
              href="#features" 
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              About
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/signin"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 rounded-b-lg">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-400 bg-blue-600/20' 
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/membership" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/membership') 
                    ? 'text-blue-400 bg-blue-600/20' 
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <a 
                href="#features" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <div className="pt-4 border-t border-gray-700">
                <Link
                  to="/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;