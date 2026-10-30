import React, { useState } from 'react';
import { formatINR, formatINRCompact, formatMultiple } from '../utils/formatters';

interface ScenarioBarChartProps {
  initialAmount: number;
  scenarios: {
    pessimistic: { fv_multiple: number; amount: number };
    base: { fv_multiple: number; amount: number };
    optimistic: { fv_multiple: number; amount: number };
  };
}

export const ScenarioBarChart: React.FC<ScenarioBarChartProps> = ({
  initialAmount,
  scenarios,
}) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const data = [
    {
      key: 'pessimistic',
      label: 'Pessimistic',
      amount: scenarios.pessimistic.amount,
      multiple: scenarios.pessimistic.fv_multiple,
      color: 'from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600',
      barBg: '#f59e0b',
      desc: 'Portfolio return minus 1 std dev volatility',
    },
    {
      key: 'base',
      label: 'Base',
      amount: scenarios.base.amount,
      multiple: scenarios.base.fv_multiple,
      color: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
      barBg: '#2563eb',
      desc: 'Weighted expected return without shocks',
    },
    {
      key: 'optimistic',
      label: 'Optimistic',
      amount: scenarios.optimistic.amount,
      multiple: scenarios.optimistic.fv_multiple,
      color: 'from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700',
      barBg: '#10b981',
      desc: 'Portfolio return plus 1 std dev volatility',
    },
  ];

  const maxVal = Math.max(...data.map((d) => d.amount), initialAmount * 1.1, 1000);
  const initialRatio = Math.min(100, Math.max(5, (initialAmount / maxVal) * 100));

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Projected Portfolio Value (Rs.)
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-0.5 border-t border-dashed border-slate-400 dark:border-slate-500" />
          <span>Invested: {formatINRCompact(initialAmount)}</span>
        </div>
      </div>

      <div className="relative h-56 flex items-end justify-around pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        {/* Invested amount reference line */}
        <div
          className="absolute left-0 right-0 border-b border-dashed border-slate-300 dark:border-slate-700 z-0 pointer-events-none transition-all duration-300"
          style={{ bottom: `${initialRatio}%` }}
        >
          <span className="absolute -top-3.5 right-2 text-[10px] font-medium text-slate-400 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 px-1 rounded border border-slate-200/50 dark:border-slate-700">
            Initial Principal
          </span>
        </div>

        {/* 3 Bars */}
        {data.map((item) => {
          const heightPct = Math.min(100, Math.max(4, (item.amount / maxVal) * 100));
          const isHovered = hoveredBar === item.key;
          const isGain = item.amount >= initialAmount;

          return (
            <div
              key={item.key}
              className="flex-1 flex flex-col items-center max-w-[100px] h-full justify-end relative group cursor-pointer z-10"
              onMouseEnter={() => setHoveredBar(item.key)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip on top */}
              <div
                className={`absolute -top-3 transition-transform duration-150 flex flex-col items-center ${
                  isHovered ? 'scale-105' : ''
                }`}
              >
                <span className="text-[11px] font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-xs border border-slate-200 dark:border-slate-700">
                  {formatINRCompact(item.amount)}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    isGain
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {formatMultiple(item.multiple)}
                </span>
              </div>

              {/* Bar */}
              <div className="w-14 sm:w-16 w-full flex items-end justify-center h-full">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 bg-linear-to-t ${
                    item.color
                  } ${isHovered ? 'brightness-110 shadow-md scale-x-105' : 'shadow-xs'}`}
                  style={{
                    height: `${heightPct}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar labels */}
      <div className="flex justify-around mt-2">
        {data.map((item) => (
          <div key={item.key} className="text-center flex-1 max-w-[100px]">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {item.label}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              {formatINR(item.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
