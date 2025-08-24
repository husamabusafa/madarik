import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-200 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            // shadcn-like input styles (adapted for dark theme)
            'flex h-10 w-full rounded-md border border-white/15 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/60 focus-visible:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
