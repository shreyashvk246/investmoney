import React from 'react';
import { Database, TrendingUp } from 'lucide-react';
import { ThemeToggleSwitch } from './ThemeToggleSwitch';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAssumptions: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleDark,
  onOpenAssumptions,
}) => {
  return (
    <header className="sticky top-0 z-30 transition-colors duration-200 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Interactive Investment Planning System
            </h1>
          </div>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
            Illustrative projections - not financial advice. Mutual fund investments are subject to market risks.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Toggle switch for Dark theme */}
          <ThemeToggleSwitch isDark={isDark} onToggle={onToggleDark} />

          <button
            type="button"
            onClick={onOpenAssumptions}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700"
          >
            <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Market Data & Assumptions</span>
          </button>
        </div>
      </div>
    </header>
  );
};
