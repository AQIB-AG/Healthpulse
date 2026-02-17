import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = (props) => {
  const { interactive, className = '', children, ...rest } = props;
  const base =
    'relative rounded-2xl bg-surface/95 shadow-soft ring-1 ring-slate-200/60 backdrop-blur-xl';
  const interactiveClasses = interactive
    ? 'transition hover:-translate-y-1 hover:shadow-elevated'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`${base} ${interactiveClasses} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

