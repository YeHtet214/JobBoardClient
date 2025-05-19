import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { LogOut, Home, Briefcase, Building, User, Settings, Menu } from 'lucide-react';
import { ModeToggle } from '../ModeToggle';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-jobboard-purple z-10">
            JobBoard
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle() + " flex items-center gap-2"}>
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/jobs" className={navigationMenuTriggerStyle() + " flex items-center gap-2"}>
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/companies" className={navigationMenuTriggerStyle() + " flex items-center gap-2"}>
                  <Building className="h-4 w-4" />
                  Companies
                </Link>
              </NavigationMenuItem>

              {/* Don't show auth-dependent links while loading */}
              {!isLoading && isAuthenticated && (
                <>
                  <NavigationMenuItem>
                    <Link to="/dashboard" className={navigationMenuTriggerStyle() + " flex items-center gap-2"}>
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                  {currentUser?.role === 'EMPLOYER' && (
                    <NavigationMenuItem>
                      <Link to="/company/profile" className={navigationMenuTriggerStyle() + " flex items-center gap-2"}>
                        <Building className="h-4 w-4" />
                        Company Profile
                      </Link>
                    </NavigationMenuItem>
                  )}
                  {currentUser?.role !== 'EMPLOYER' && (
                    <NavigationMenuItem>
                      <Link to="/profile" className={navigationMenuTriggerStyle() + " flex items-center gap-2"}>
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </NavigationMenuItem>
                  )}
                  <NavigationMenuItem>
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="flex items-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && !isAuthenticated && (
              <>
                <Link to="/login" className="text-sm font-medium transition-colors hover:text-jobboard-purple">
                  Login
                </Link>
                <Button asChild>
                  <Link to="/register">
                    Register
                  </Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-6">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link 
                  to="/jobs" 
                  className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                >
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </Link>
                <Link 
                  to="/companies" 
                  className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                >
                  <Building className="h-4 w-4" />
                  Companies
                </Link>
                
                {/* Don't show auth-dependent links while loading */}
                {!isLoading && (
                  isAuthenticated ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                      {currentUser?.role === 'EMPLOYER' && (
                        <Link 
                          to="/company/profile" 
                          className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                        >
                          <Building className="h-4 w-4" />
                          Company Profile
                        </Link>
                      )}
                      {currentUser?.role !== 'EMPLOYER' && (
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      )}
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="flex items-center gap-2 justify-start p-2 h-auto font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 mt-2">
                      <Link 
                        to="/login" 
                        className="text-sm font-medium transition-colors hover:text-jobboard-purple"
                      >
                        Login
                      </Link>
                      <Button asChild>
                        <Link to="/register">
                          Register
                        </Link>
                      </Button>
                    </div>
                  )
                )}
                <div className="mt-2">
                  <ModeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;