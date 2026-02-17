import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = (props) => {
  const { label, error, className = '', ...rest } = props;
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-medium text-text-muted">{label}</span>}
      <input
        className={`h-11 rounded-xl border border-slate-200/80 bg-surface/80 px-3 text-sm text-text-primary shadow-sm outline-none ring-primary/30 transition focus:border-primary focus:ring-2 ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
};

