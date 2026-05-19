import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

export function SimulatedChart({ h = 200 }: { h?: number }) {
  const { theme } = useTheme();
  
  // Generate random path
  const points = useMemo(() => {
    let current = 50;
    return Array.from({ length: 40 }, (_, i) => {
      current += (Math.random() - 0.5) * 15;
      if (current < 10) current = 10;
      if (current > 90) current = 90;
      return `${(i / 39) * 100},${current}`;
    }).join(' ');
  }, []);

  return (
    <div style={{ height: h }} className="w-full relative flex items-end overflow-hidden px-1">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill="url(#chartGradient)"
        />
        
        {/* Stroke */}
        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          fill="none"
          stroke="#2563EB"
          strokeWidth="1.5"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-t border-text-primary w-full"></div>
        ))}
      </div>
    </div>
  );
}
