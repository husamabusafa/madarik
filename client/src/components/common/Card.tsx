import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  children: React.ReactNode;
}

export default function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm',
  };

  return (
    <motion.div
      className={clsx(
        'rounded-xl p-6 transition-all duration-200',
        variantClasses[variant],
        className
      )}
      whileHover={{ y: -2, shadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
