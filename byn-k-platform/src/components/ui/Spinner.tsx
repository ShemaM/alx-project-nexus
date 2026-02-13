import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { outer: 20, stroke: 2, dasharray: '40 20' },
    md: { outer: 32, stroke: 3, dasharray: '65 35' },
    lg: { outer: 48, stroke: 4, dasharray: '100 50' }
  };

  const config = sizeMap[size];
  const r = (config.outer / 2) - config.stroke;

  return (
    <div
      className={`relative ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg 
        className="animate-spin" 
        style={{ width: config.outer, height: config.outer, animationDuration: '1.5s' }}
      >
        <defs>
          <linearGradient id={`spinner-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D8FDD" />
            <stop offset="50%" stopColor="#F5D300" />
            <stop offset="100%" stopColor="#D52B2B" />
          </linearGradient>
        </defs>
        <circle 
          cx={config.outer / 2} 
          cy={config.outer / 2} 
          r={r} 
          fill="none" 
          stroke={`url(#spinner-gradient-${size})`}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={config.dasharray}
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
