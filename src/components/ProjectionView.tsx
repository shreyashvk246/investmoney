import React, { useState } from 'react';
import { ProjectionResult } from '../types';
import {
  formatINRCompact,
  formatMultiple,
  formatPercent,
} from '../utils/formatters';
import { ScenarioBarChart } from './ScenarioBarChart';
import { GrowthTrajectoryChart } from './GrowthTrajectoryChart';
import {
  TrendingUp,
  BarChart3,
  LineChart,
  Dices,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface ProjectionViewProps {
  amount: number;
  projection: ProjectionResult;
  horizonYears: number;
}

export const ProjectionView: React.FC<ProjectionViewProps> = ({
  amount,
  projection,
  horizonYears,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'bar' | 'trajectory'>('bar');

  const p = projection.monte_carlo;
  const scenarios = projection.scenarios;

  return (
    <div className="rounded-2xl border transition-colors duration-200 p-5 flex flex-col gap-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
            Projection ({horizonYears} {horizonYears === 1 ? 'Year' : 'Years'}, illustrative)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">
            Exp Return: {formatPercent(projection.portfolio_expected_return * 100, 1)}
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">
            Vol: {formatPercent(projection.portfolio_volatility * 100, 1)}
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pessimistic */}
        <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl p-3.5 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Pessimistic (approx)
            </span>
            <ArrowDownRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-1">
            <p className="text-lg font-extrabold text-amber-950 dark:text-amber-100 font-mono tracking-tight">
              Rs. {Math.round(scenarios.pessimistic.amount).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {formatMultiple(scenarios.pessimistic.fv_multiple)}
              </span>
              <span className="text-[10px] text-amber-600/90 dark:text-amber-400/80">
                ({formatINRCompact(scenarios.pessimistic.amount)})
              </span>
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl p-3.5 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
              Base (expected)
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-1">
            <p className="text-lg font-extrabold text-blue-950 dark:text-blue-100 font-mono tracking-tight">
              Rs. {Math.round(scenarios.base.amount).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                {formatMultiple(scenarios.base.fv_multiple)}
              </span>
              <span className="text-[10px] text-blue-600/90 dark:text-blue-400/80">
                ({formatINRCompact(scenarios.base.amount)})
              </span>
            </div>
          </div>
        </div>

        {/* Optimistic */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-3.5 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Optimistic (approx)
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1">
            <p className="text-lg font-extrabold text-emerald-950 dark:text-emerald-100 font-mono tracking-tight">
              Rs. {Math.round(scenarios.optimistic.amount).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {formatMultiple(scenarios.optimistic.fv_multiple)}
              </span>
              <span className="text-[10px] text-emerald-600/90 dark:text-emerald-400/80">
                ({formatINRCompact(scenarios.optimistic.amount)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monte Carlo & Inflation Summary Card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 transition-colors">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-lg">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Monte Carlo Simulation ({p.n} paths)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-mono">
                <span className="font-semibold text-amber-700 dark:text-amber-400">P10 = {p.p10.toFixed(2)}x</span>
                {' • '}
                <span className="font-semibold text-blue-700 dark:text-blue-400">P50 = {p.p50.toFixed(2)}x</span>
                {' • '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">P90 = {p.p90.toFixed(2)}x</span> of amount
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Inflation-adjusted (P50): </span>
              <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                {projection.inflation_adjusted_p50_multiple.toFixed(2)}x
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">
                ({formatINRCompact(projection.inflation_adjusted_p50_rupees)})
              </span>
            </div>
          </div>
        </div>

        {/* Visual Percentile Range Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            <span>P10 (10th Percentile)</span>
            <span>P50 (Median Expected)</span>
            <span>P90 (90th Percentile)</span>
          </div>
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-linear-to-r from-amber-400 via-blue-500 to-emerald-500 rounded-full"
              style={{
                left: `${Math.min(90, Math.max(5, (p.p10 / Math.max(p.p90, 0.1)) * 30))}%`,
                right: '5%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Chart selection toggles */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Visual Comparison</span>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveChartTab('bar')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              activeChartTab === 'bar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Scenario Bar</span>
          </button>
          <button
            onClick={() => setActiveChartTab('trajectory')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              activeChartTab === 'trajectory'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Compound Trajectory</span>
          </button>
        </div>
      </div>

      {/* Charts */}
      {activeChartTab === 'bar' ? (
        <ScenarioBarChart
          initialAmount={amount}
          scenarios={scenarios}
        />
      ) : (
        <GrowthTrajectoryChart data={projection.yearly_projection} />
      )}
    </div>
  );
};
