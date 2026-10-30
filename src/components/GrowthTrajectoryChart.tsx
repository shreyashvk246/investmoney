import React, { useState } from 'react';
import { ProjectionYearData } from '../types';
import { formatINRCompact } from '../utils/formatters';

interface GrowthTrajectoryChartProps {
  data: ProjectionYearData[];
}

export const GrowthTrajectoryChart: React.FC<GrowthTrajectoryChartProps> = ({ data }) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.optimistic, d.base, d.pessimistic, d.inflationBenchmark)),
    1000
  );

  const width = 500;
  const height = 180;
  const padding = { top: 15, right: 15, bottom: 25, left: 45 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getX = (year: number) => {
    const maxYear = data[data.length - 1].year || 1;
    return padding.left + (year / maxYear) * innerWidth;
  };

  const getY = (val: number) => {
    return padding.top + innerHeight - (val / maxVal) * innerHeight;
  };

  const generatePath = (key: 'optimistic' | 'base' | 'pessimistic' | 'inflationBenchmark') => {
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.year).toFixed(1)} ${getY(d[key]).toFixed(1)}`)
      .join(' ');
  };

  const hoveredData = hoveredYear !== null ? data.find((d) => d.year === hoveredYear) : null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs mt-3 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Trajectory Over Time (Years 0 to {data[data.length - 1]?.year})
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-emerald-500 rounded" /> Optimistic
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-blue-500 rounded" /> Base
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-500 rounded" /> Pessimistic
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 border-t border-dashed border-rose-400" /> Inflation (6%)
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          onMouseLeave={() => setHoveredYear(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const val = maxVal * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  className="stroke-slate-100 dark:stroke-slate-800/80"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono"
                >
                  {formatINRCompact(val)}
                </text>
              </g>
            );
          })}

          {/* Paths */}
          <path
            d={generatePath('inflationBenchmark')}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path
            d={generatePath('pessimistic')}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={generatePath('base')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={generatePath('optimistic')}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Interactive vertical hover indicator */}
          {hoveredData && (
            <g>
              <line
                x1={getX(hoveredData.year)}
                y1={padding.top}
                x2={getX(hoveredData.year)}
                y2={height - padding.bottom}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredData.year)}
                cy={getY(hoveredData.optimistic)}
                r="3.5"
                fill="#10b981"
              />
              <circle
                cx={getX(hoveredData.year)}
                cy={getY(hoveredData.base)}
                r="4"
                fill="#3b82f6"
              />
              <circle
                cx={getX(hoveredData.year)}
                cy={getY(hoveredData.pessimistic)}
                r="3.5"
                fill="#f59e0b"
              />
            </g>
          )}

          {/* Hover trigger zones */}
          {data.map((d) => (
            <rect
              key={d.year}
              x={getX(d.year) - 10}
              y={padding.top}
              width={20}
              height={innerHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredYear(d.year)}
            />
          ))}

          {/* X axis labels */}
          {data
            .filter((d, i) => i === 0 || d.year === data[data.length - 1].year || d.year % 5 === 0)
            .map((d) => (
              <text
                key={d.year}
                x={getX(d.year)}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium"
              >
                Y{d.year}
              </text>
            ))}
        </svg>

        {/* Floating tooltip for year hover */}
        {hoveredData && (
          <div className="absolute top-1 right-2 bg-slate-900/95 dark:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg backdrop-blur-sm pointer-events-none flex items-center gap-3 border border-slate-700">
            <span className="font-bold text-blue-400">Year {hoveredData.year}:</span>
            <span>Opt: {formatINRCompact(hoveredData.optimistic)}</span>
            <span className="font-semibold text-sky-300">Base: {formatINRCompact(hoveredData.base)}</span>
            <span>Pess: {formatINRCompact(hoveredData.pessimistic)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
