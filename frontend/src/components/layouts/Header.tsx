// import React, { useEffect, useState } from 'react';

// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/authContext';
// import { LogOut, Home, Briefcase, Building, User, Settings, Menu } from 'lucide-react';
// import { ModeToggle } from '../ModeToggle';

// import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuList,
//   navigationMenuTriggerStyle,
// } from '@/components/ui/navigation-menu';

// const Header: React.FC = () => {
//   const { currentUser, logout, isAuthenticated, isLoading } = useAuth();
//   const [isActivePage, setIsActivePage] = useState<string>('');
//   const navigate = useNavigate();

//   const location = useLocation();

//   useEffect(() => {
//     setIsActivePage(location.pathname.split('/')[1]);
//   }, [location]);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   return (
//     <header className="border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-jobboard-purple z-10">
//             JobBoard
//           </Link>

//           {/* Desktop Navigation */}
//           <NavigationMenu className="hidden md:flex">
//             <NavigationMenuList>
//               <NavigationMenuItem>
//                 <Link to="/" className={`${navigationMenuTriggerStyle()} flex items-center gap-1 font-semibold ${isActivePage === '' ? '!text-jobboard-purple !font-semibold bg-gray-100' : ''}`}>
//                   <Home className="h-4 w-4" />
//                   Home
//                 </Link>
//               </NavigationMenuItem>
//               <NavigationMenuItem>
//                 <Link to="/jobs" className={`${navigationMenuTriggerStyle()} flex items-center gap-1 font-semibold ${isActivePage === 'jobs' ? '!text-jobboard-purple !font-semibold bg-gray-100' : ''}`}>
//                   <Briefcase className="h-4 w-4" />
//                   Jobs
//                 </Link>
//               </NavigationMenuItem>
//               <NavigationMenuItem>
//                 <Link to="/companies" className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActivePage === 'companies' ? '!text-jobboard-purple !font-semibold bg-gray-100' : ''}`}>
//                   <Building className="h-4 w-4" />
//                   Companies
//                 </Link>
//               </NavigationMenuItem>

//               {/* Don't show auth-dependent links while loading */}
//               {!isLoading && isAuthenticated && (
//                 <>
//                   <NavigationMenuItem>
//                     <Link to="/dashboard" className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActivePage === 'dashboard' ? '!text-jobboard-purple !font-semibold bg-gray-100' : ''}`}>
//                       <User className="h-4 w-4" />
//                       Dashboard
//                     </Link>
//                   </NavigationMenuItem>
//                   {currentUser?.role === 'EMPLOYER' && (
//                     <NavigationMenuItem>
//                       <Link to="/company/profile" className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActivePage === 'company' ? '!text-jobboard-purple !font-semibold bg-gray-100' : ''}`}>
//                         <Building className="h-4 w-4" />
//                         Company Profile
//                       </Link>
//                     </NavigationMenuItem>
//                   )}
//                   {currentUser?.role !== 'EMPLOYER' && (
//                     <NavigationMenuItem>
//                       <Link to="/profile" className={`${navigationMenuTriggerStyle()} flex items-center gap-1 ${isActivePage === 'profile' ? '!text-jobboard-purple !font-semibold bg-gray-100' : ''}`}>
//                         <User className="h-4 w-4" />
//                         Profile
//                       </Link>
//                     </NavigationMenuItem>
//                   )}
//                   <NavigationMenuItem>
//                     <Button 
//                       variant="ghost" 
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       Logout
//                     </Button>
//                   </NavigationMenuItem>
//                 </>
//               )}
//             </NavigationMenuList>
//           </NavigationMenu>

//           {/* Auth Buttons (Desktop) */}
//           <div className="hidden md:flex items-center gap-4">
//             {!isLoading && !isAuthenticated && (
//               <>
//                 <Link to="/login" className="text-sm font-medium transition-colors hover:text-jobboard-purple">
//                   Login
//                 </Link>
//                 <Button asChild>
//                   <Link to="/register">
//                     Register
//                   </Link>
//                 </Button>
//               </>
//             )}
//             <ModeToggle />
//           </div>

//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild className="md:hidden">
//               <Button variant="ghost" size="icon">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//               <nav className="flex flex-col gap-4 mt-6">
//                 <Link 
//                   to="/" 
//                   className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === '' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                 >
//                   <Home className="h-4 w-4" />
//                   Home
//                 </Link>
//                 <Link 
//                   to="/jobs" 
//                   className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === 'jobs' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                 >
//                   <Briefcase className="h-4 w-4" />
//                   Jobs
//                 </Link>
//                 <Link 
//                   to="/companies" 
//                   className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === 'companies' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                 >
//                   <Building className="h-4 w-4" />
//                   Companies
//                 </Link>
                
//                 {/* Don't show auth-dependent links while loading */}
//                 {!isLoading && (
//                   isAuthenticated ? (
//                     <>
//                       <Link 
//                         to="/dashboard" 
//                         className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === 'dashboard' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                       >
//                         <User className="h-4 w-4" />
//                         Dashboard
//                       </Link>
//                       {currentUser?.role === 'EMPLOYER' && (
//                         <Link 
//                           to="/company/profile" 
//                           className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === 'company' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                         >
//                           <Building className="h-4 w-4" />
//                           Company Profile
//                         </Link>
//                       )}
//                       {currentUser?.role !== 'EMPLOYER' && (
//                         <Link 
//                           to="/profile" 
//                           className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === 'profile' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                         >
//                           <User className="h-4 w-4" />
//                           Profile
//                         </Link>
//                       )}
//                       <Link 
//                         to="/settings" 
//                         className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-jobboard-purple ${isActivePage === 'settings' ? 'text-jobboard-darkblue font-semibold' : ''}`}
//                       >
//                         <Settings className="h-4 w-4" />
//                         Settings
//                       </Link>
//                       <Button 
//                         variant="ghost" 
//                         onClick={handleLogout}
//                         className="flex items-center gap-2 justify-start p-2 h-auto font-medium"
//                       >
//                         <LogOut className="h-4 w-4" />
//                         Logout
//                       </Button>
//                     </>
//                   ) : (
//                     <div className="flex flex-col gap-3 mt-2">
//                       <Link 
//                         to="/login" 
//                         className="text-sm font-medium transition-colors hover:text-jobboard-purple"
//                       >
//                         Login
//                       </Link>
//                       <Button asChild>
//                         <Link to="/register">
//                           Register
//                         </Link>
//                       </Button>
//                     </div>
//                   )
//                 )}
//                 <div className="mt-2">
//                   <ModeToggle />
//                 </div>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const [isActivePage, setIsActivePage] = useState<string>('');
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setIsActivePage(location.pathname.split('/')[1]);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkBaseClasses = 'flex items-center gap-1 text-sm font-medium transition-colors rounded-md px-3 py-2';
  const activeLinkClasses = '!text-jb-primary bg-jb-highlight !font-semibold';

  return (
    <header className="border-b bg-jb-bg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-jb-primary z-10">
            JobBoard
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  to="/"
                  className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === '' ? activeLinkClasses : ''}`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/jobs"
                  className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'jobs' ? activeLinkClasses : ''}`}
                >
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/companies"
                  className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'companies' ? activeLinkClasses : ''}`}
                >
                  <Building className="h-4 w-4" />
                  Companies
                </Link>
              </NavigationMenuItem>

              {!isLoading && isAuthenticated && (
                <>
                  <NavigationMenuItem>
                    <Link
                      to="/dashboard"
                      className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'dashboard' ? activeLinkClasses : ''}`}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </NavigationMenuItem>

                  {currentUser?.role === 'EMPLOYER' && (
                    <NavigationMenuItem>
                      <Link
                        to="/company/profile"
                        className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'company' ? activeLinkClasses : ''}`}
                      >
                        <Building className="h-4 w-4" />
                        Company Profile
                      </Link>
                    </NavigationMenuItem>
                  )}

                  {currentUser?.role !== 'EMPLOYER' && (
                    <NavigationMenuItem>
                      <Link
                        to="/profile"
                        className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'profile' ? activeLinkClasses : ''}`}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </NavigationMenuItem>
                  )}

                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && !isAuthenticated && (
              <>
                <Link to="/login" className="text-sm font-medium transition-colors hover:text-jb-primary">
                  Login
                </Link>
                <Button asChild>
                  <Link to="/register">Register</Link>
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
                {[
                  { path: '/', icon: <Home className="h-4 w-4" />, label: 'Home' },
                  { path: '/jobs', icon: <Briefcase className="h-4 w-4" />, label: 'Jobs' },
                  { path: '/companies', icon: <Building className="h-4 w-4" />, label: 'Companies' },
                ].map(({ path, icon, label }) => {
                  const page = path.split('/')[1];
                  return (
                    <Link
                      key={label}
                      to={path}
                      className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        isActivePage === page ? 'text-jb-primary bg-jb-highlight font-semibold' : 'hover:text-jb-primary'
                      }`}
                    >
                      {icon}
                      {label}
                    </Link>
                  );
                })}

                {!isLoading && isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        isActivePage === 'dashboard' ? 'text-jb-primary bg-jb-highlight font-semibold' : 'hover:text-jb-primary'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    {currentUser?.role === 'EMPLOYER' && (
                      <Link
                        to="/company/profile"
                        className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          isActivePage === 'company' ? 'text-jb-primary bg-jb-highlight font-semibold' : 'hover:text-jb-primary'
                        }`}
                      >
                        <Building className="h-4 w-4" />
                        Company Profile
                      </Link>
                    )}
                    {currentUser?.role !== 'EMPLOYER' && (
                      <Link
                        to="/profile"
                        className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          isActivePage === 'profile' ? 'text-jb-primary bg-jb-highlight font-semibold' : 'hover:text-jb-primary'
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        isActivePage === 'settings' ? 'text-jb-primary bg-jb-highlight font-semibold' : 'hover:text-jb-primary'
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center gap-2 justify-start px-3 py-2 text-sm font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}

                {!isLoading && !isAuthenticated && (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link to="/login" className="text-sm font-medium transition-colors hover:text-jb-primary">
                      Login
                    </Link>
                    <Button asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
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
