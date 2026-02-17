import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
}

const baseClasses =
  'relative inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-accent text-white shadow-soft hover:shadow-glow hover:from-primary hover:to-accent',
  secondary:
    'bg-surface text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/5',
  ghost: 'bg-transparent text-text-muted hover:text-primary hover:bg-primary/5',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    loading,
    children,
    className = '',
    ...rest
  } = props;
  const classes = `${baseClasses} ${variantClasses[variant as Variant]} ${
    sizeClasses[size as Size]
  } ${className}`;

  return (
    <motion.button
      whileHover={{ scale: props.disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled || loading ? 1 : 0.98 }}
      className={classes}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

