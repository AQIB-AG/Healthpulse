import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { className = '', ...rest } = props;
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 bg-gradient-to-r from-slate-200/80 via-slate-100/80 to-slate-200/80 bg-[length:200%_100%] ${className}`}
      {...rest}
    />
  );
};

