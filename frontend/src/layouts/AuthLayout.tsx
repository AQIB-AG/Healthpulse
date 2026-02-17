import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-primary/10 via-background to-accent/10">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.3),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.35),_transparent_55%)]" />
        <div className="relative z-10 max-w-md px-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
            HealthPulse
          </p>
          <h1 className="mb-4 text-3xl font-semibold text-white drop-shadow-md">
            Empowering regional health intelligence.
          </h1>
          <p className="text-sm text-slate-100/80">
            Hospitals submit live disease data. HealthPulse turns it into transparent, regional
            insights for everyone.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 items-center justify-center px-4 py-10 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl bg-surface/95 p-6 shadow-elevated ring-1 ring-white/40 backdrop-blur-xl md:p-8"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

