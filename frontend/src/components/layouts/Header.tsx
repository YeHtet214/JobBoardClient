import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { LogOut, Home, Briefcase, Building, User, Settings, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated, isLoading } = useAuth();
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
            <Link to="/" className="text-gray-600 hover:text-jobboard-purple transition flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link to="/jobs" className="text-gray-600 hover:text-jobboard-purple transition flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Link>
            <Link to="/companies" className="text-gray-600 hover:text-jobboard-purple transition flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Companies
            </Link>

            {/* Don't show auth-dependent links while loading */}
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-jobboard-purple transition flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  {currentUser?.role === 'EMPLOYER' && (
                    <Link to="/company/profile" className="text-gray-600 hover:text-jobboard-purple transition flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Company Profile
                    </Link>
                  )}
                  {currentUser?.role !== 'EMPLOYER' && (
                    <Link to="/profile" className="text-gray-600 hover:text-jobboard-purple transition flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-jobboard-purple transition flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
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
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 md:hidden space-y-3 pb-3">
            <Link 
              to="/" 
              className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link 
              to="/jobs" 
              className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Link>
            <Link 
              to="/companies" 
              className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building className="h-4 w-4 mr-2" />
              Companies
            </Link>
            
            {/* Don't show auth-dependent links while loading */}
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  {currentUser?.role === 'EMPLOYER' && (
                    <Link 
                      to="/company/profile" 
                      className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Company Profile
                    </Link>
                  )}
                  {currentUser?.role !== 'EMPLOYER' && (
                    <Link 
                      to="/profile" 
                      className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  )}
                  <Link 
                    to="/settings" 
                    className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-jobboard-purple transition flex items-center py-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="block text-gray-600 hover:text-jobboard-purple transition py-2"
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
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;