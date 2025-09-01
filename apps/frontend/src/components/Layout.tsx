import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">
            🍽️ Restaurant MERN
          </h1>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Restaurant MERN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
