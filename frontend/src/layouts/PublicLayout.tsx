import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/public/overview', label: 'Live Insights' },
  { path: '/public/comparison', label: 'Comparison' },
];

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 via-background to-background text-text-primary">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-primary to-accent shadow-glow" />
            <span className="text-lg font-semibold tracking-tight">HealthPulse</span>
          </Link>
          <nav className="relative hidden gap-4 rounded-full bg-surface/70 p-1 text-sm font-medium shadow-soft md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="public-nav-active"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Link
                    to={item.path}
                    className={`relative z-10 rounded-full px-4 py-1.5 transition-colors ${
                      isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
          <Link
            to="/hospital/login"
            className="rounded-full bg-surface/90 px-4 py-1.5 text-sm font-medium text-primary shadow-soft hover:bg-primary hover:text-white transition-colors"
          >
            Hospital Portal
          </Link>
        </div>
      </header>

      <motion.main
        className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6 md:pt-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

