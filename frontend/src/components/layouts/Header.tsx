import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-jobboard-purple">
            JobBoard
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:!flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-jobboard-purple transition">
              Home
            </Link>
            <Link to="/jobs" className="text-gray-600 hover:text-jobboard-purple transition">
              Jobs
            </Link>
            <Link to="/companies" className="text-gray-600 hover:text-jobboard-purple transition">
              Companies
            </Link>
            
            {isAuthenticated ? (
              <>
                {currentUser?.role === 'EMPLOYER' && (
                  <Link to="/employer/dashboard" className="text-gray-600 hover:text-jobboard-purple transition">
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center text-gray-600 hover:text-jobboard-purple transition">
                    <span className="mr-1">Account</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-jobboard-light hover:text-jobboard-darkblue">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-jobboard-light hover:text-jobboard-darkblue">
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-jobboard-light hover:text-jobboard-darkblue"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-jobboard-purple transition">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-jobboard-purple text-white px-4 py-2 rounded hover:bg-jobboard-purple/90 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 md:hidden space-y-3 pb-3">
            <Link 
              to="/" 
              className="block text-gray-600 hover:text-jobboard-purple transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className="block text-gray-600 hover:text-jobboard-purple transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link 
              to="/companies" 
              className="block text-gray-600 hover:text-jobboard-purple transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </Link>
            
            {isAuthenticated ? (
              <>
                {currentUser?.role === 'EMPLOYER' && (
                  <Link 
                    to="/employer/dashboard" 
                    className="block text-gray-600 hover:text-jobboard-purple transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block text-gray-600 hover:text-jobboard-purple transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="block text-gray-600 hover:text-jobboard-purple transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-gray-600 hover:text-jobboard-purple transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="block text-gray-600 hover:text-jobboard-purple transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="inline-block bg-jobboard-purple text-white px-4 py-2 rounded hover:bg-jobboard-purple/90 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;