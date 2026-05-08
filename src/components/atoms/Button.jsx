import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'bg-text-main text-white hover:bg-black',
    outline: 'bg-transparent border border-gray-200 text-text-main hover:bg-gray-50',
    ghost: 'bg-transparent text-text-secondary hover:text-accent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-10 py-4 text-base font-bold',
    xl: 'px-12 py-5 text-lg font-bold',
  };

  return (
    <button 
      className={cn(
        'rounded-xl transition-all flex items-center justify-center transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
