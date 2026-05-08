import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-white/90 backdrop-blur-md text-text-main border-gray-100',
    accent: 'bg-accent text-white border-accent',
    pending: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <span className={cn(
      "text-[10px] uppercase font-bold px-4 py-2 rounded-full border shadow-sm",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
