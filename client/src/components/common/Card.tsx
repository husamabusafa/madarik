import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps extends React.ComponentProps<typeof motion.div> {
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
    default: 'bg-slate-900/70 border border-slate-800 shadow-xl text-slate-100',
    glass: 'bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl text-slate-100',
    gradient: 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-800 text-slate-100',
  };

  return (
    <motion.div
      className={clsx(
        'rounded-xl p-6 transition-all duration-200',
        variantClasses[variant],
        className
      )}
      whileHover={{ y: -2, boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.35)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
