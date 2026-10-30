import React from 'react';
import { EquityCaps } from '../types';
import { formatINRCompact } from '../utils/formatters';
import { RotateCcw, Sparkles } from 'lucide-react';

interface SidebarInputsProps {
  amount: number;
  setAmount: (val: number) => void;
  horizonYears: number;
  setHorizonYears: (val: number) => void;
  risk: number;
  setRisk: (val: number) => void;
  liquidityPct: number;
  setLiquidityPct: (val: number) => void;
  caps?: EquityCaps;
  onReset: () => void;
}

const AMOUNT_PRESETS = [
  { label: '₹50K', value: 50000 },
  { label: '₹2L', value: 200000 },
  { label: '₹5L', value: 500000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹25L', value: 2500000 },
];

const RISK_LABELS: Record<number, { label: string; desc: string; badge: string }> = {
  1: { label: 'Conservative', desc: 'Capital preservation first', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  2: { label: 'Moderately Conservative', desc: 'Low tolerance for drawdowns', badge: 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  3: { label: 'Moderate', desc: 'Balanced risk & long-term growth', badge: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  4: { label: 'Growth Oriented', desc: 'Comfortable with volatility', badge: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
  5: { label: 'Aggressive', desc: 'Maximum wealth compounding', badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
};

export const SidebarInputs: React.FC<SidebarInputsProps> = ({
  amount,
  setAmount,
  horizonYears,
  setHorizonYears,
  risk,
  setRisk,
  liquidityPct,
  setLiquidityPct,
  caps,
  onReset,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 flex flex-col gap-6 transition-colors duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Inputs</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters</p>
        </div>
        <button
          onClick={onReset}
          title="Reset to defaults"
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Investment Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="amount-input" className="font-semibold text-slate-700 dark:text-slate-300">
            Investment amount (Rs.)
          </label>
          <span className="font-mono text-slate-500 dark:text-slate-400">{formatINRCompact(amount)}</span>
        </div>
        <div className="relative rounded-lg shadow-2xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-semibold">
            ₹
          </span>
          <input
            id="amount-input"
            type="number"
            min={1000}
            step={1000}
            value={amount}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAmount(isNaN(val) ? 0 : val);
            }}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {AMOUNT_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setAmount(p.value)}
              className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                amount === p.value
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Investment Duration Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Investment duration (years)
          </label>
          <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full font-mono border border-blue-100 dark:border-blue-900/50">
            {horizonYears} {horizonYears === 1 ? 'Year' : 'Years'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={horizonYears}
          onChange={(e) => setHorizonYears(parseInt(e.target.value, 10))}
          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <span>1 yr</span>
          <span>5 yrs</span>
          <span>10 yrs</span>
          <span>20 yrs</span>
          <span>30 yrs</span>
        </div>
      </div>

      {/* Risk Tolerance Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Risk tolerance (1 = Low, 5 = High)
          </label>
          <span
            className={`font-semibold text-[11px] px-2 py-0.5 rounded-full ${
              RISK_LABELS[risk]?.badge || 'bg-slate-100'
            }`}
          >
            Level {risk}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={risk}
          onChange={(e) => setRisk(parseInt(e.target.value, 10))}
          className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span>1: Low</span>
          <span>3: Med</span>
          <span>5: High</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          {RISK_LABELS[risk]?.label}: {RISK_LABELS[risk]?.desc}
        </p>
      </div>

      {/* Liquidity Need Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Liquidity need within 1 year (%)
          </label>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-mono border border-emerald-100 dark:border-emerald-900/50">
            {liquidityPct}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={liquidityPct}
          onChange={(e) => setLiquidityPct(parseFloat(e.target.value))}
          className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Reserved immediately into Liquid / Cash instruments.
        </p>
      </div>

      {/* Equity Caps Diagnostic Box */}
      {caps && (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Dynamic Equity Guardrails</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Risk Cap</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {(caps.risk_cap * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Horizon Cap</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {(caps.horizon_cap * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/60 p-2 rounded-lg border border-blue-100 dark:border-blue-900/60">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium block">Total Cap</span>
              <span className="font-extrabold text-blue-700 dark:text-blue-300">
                {(caps.equity_cap_total * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
