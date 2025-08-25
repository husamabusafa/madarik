import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const positionClasses: Record<NonNullable<TooltipProps['position']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className = '' }) => {
  return (
    <span className={`relative inline-flex group ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute whitespace-nowrap rounded-md bg-slate-900 text-slate-100 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg border border-slate-700 ${positionClasses[position]}`}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
