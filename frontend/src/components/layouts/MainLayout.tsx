import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow min-h-90">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
