import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Input = ({ label, icon: Icon, error, className, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] uppercase font-bold text-text-secondary ml-1 tracking-widest">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={cn(
            "w-full bg-white border border-gray-100 rounded-xl py-4 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent",
            Icon ? "pl-12" : "pl-4",
            error ? "border-red-500" : "border-gray-200",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
