import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/hospital/dashboard', label: 'Overview' },
  { path: '/hospital/analytics', label: 'Analytics' },
  { path: '/hospital/reports', label: 'Reports' },
];

export const HospitalLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-950/3">
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-slate-200/70 bg-surface/95 shadow-soft md:flex">
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-accent" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Hospital
            </p>
            <p className="text-sm font-semibold text-text-primary">HealthPulse</p>
          </div>
        </div>
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-text-muted hover:text-primary',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="hospital-nav-active"
                      className="absolute inset-0 rounded-xl bg-primary/8"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200/70 px-4 py-4 text-xs text-text-muted">
          Logged in as
          <span className="ml-1 font-medium text-text-primary">Demo Hospital</span>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col bg-background">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Dashboard</p>
              <h1 className="text-lg font-semibold text-text-primary">Hospital Overview</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent text-xs font-semibold text-white shadow-soft" />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 pb-8 pt-4 md:px-6 md:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

