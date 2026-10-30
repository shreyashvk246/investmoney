import React, { useState } from 'react';
import { AssetName } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';

interface DonutSlice {
  asset: AssetName;
  pct: number;
  rupees: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  totalAmount: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ slices, totalAmount }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeSlices = slices.filter((s) => s.pct > 0.01);
  const totalPct = activeSlices.reduce((acc, s) => acc + s.pct, 0);

  // SVG parameters
  const size = 260;
  const strokeWidth = 36;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-[260px] h-[260px]">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform -rotate-90 filter drop-shadow-sm"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            className="stroke-slate-100 dark:stroke-slate-800 transition-colors"
            strokeWidth={strokeWidth}
          />
          {activeSlices.map((slice, index) => {
            const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPct / 100) * circumference);
            accumulatedPct += slice.pct;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={slice.asset}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer ease-out"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1,
                }}
              />
            );
          })}
        </svg>

        {/* Center content (Donut Hole 40%) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {hoveredIndex !== null && activeSlices[hoveredIndex] ? (
            <div className="animate-in fade-in zoom-in-95 duration-150">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mb-1"
                style={{ backgroundColor: activeSlices[hoveredIndex].color }}
              />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                {activeSlices[hoveredIndex].asset}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formatPercent(activeSlices[hoveredIndex].pct, 1)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {formatINR(activeSlices[hoveredIndex].rupees)}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Portfolio
              </p>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white">
                {formatPercent(totalPct, 0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {formatINR(totalAmount)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend below */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 max-w-sm">
        {activeSlices.map((slice, index) => (
          <div
            key={slice.asset}
            className={`flex items-center gap-1.5 text-xs cursor-pointer transition-opacity ${
              hoveredIndex !== null && hoveredIndex !== index ? 'opacity-40' : 'opacity-100'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="font-medium text-slate-700 dark:text-slate-300">{slice.asset}</span>
            <span className="text-slate-400 dark:text-slate-500">({slice.pct.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
