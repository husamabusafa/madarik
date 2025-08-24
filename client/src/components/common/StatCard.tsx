import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  color = 'blue',
  className,
}: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'text-blue-100',
      change: 'text-blue-200',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      icon: 'text-green-100',
      change: 'text-green-200',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'text-purple-100',
      change: 'text-purple-200',
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      icon: 'text-orange-100',
      change: 'text-orange-200',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'text-red-100',
      change: 'text-red-200',
    },
  };

  const currentColor = colorClasses[color];

  return (
    <motion.div
      className={clsx(
        'relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white shadow-lg',
        currentColor.bg,
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {change && (
              <motion.div
                className={clsx('mt-2 flex items-center text-sm', currentColor.change)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={clsx('flex items-center')}>
                  {change.type === 'increase' ? (
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {change.value}%
                </span>
              </motion.div>
            )}
          </div>
          <div className={clsx('rounded-full bg-white/20 p-3', currentColor.icon)}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
