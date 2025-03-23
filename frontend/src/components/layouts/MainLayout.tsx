import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  console.log("Test Logging")

  useEffect(() => {
    console.log("Test Logging")
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
