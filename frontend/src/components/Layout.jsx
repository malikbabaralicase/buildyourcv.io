import React from 'react';
import { useLocation } from 'react-router-dom';
import CanvasBackground from './CanvasBackground';
import CanvasErrorBoundary from './three/CanvasErrorBoundary';

const Layout = ({ children }) => {
  const location = useLocation();
  const variant = location.pathname === '/' ? 'landing' : 'app';

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <CanvasErrorBoundary>
          <CanvasBackground variant={variant} />
        </CanvasErrorBoundary>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
