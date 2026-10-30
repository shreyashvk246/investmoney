import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({
  isDark,
  onToggle,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer select-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
    >
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
      <div
        className={`relative inline-flex h-7 w-13 items-center rounded-full p-0.5 transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border border-slate-700'
            : 'bg-slate-300 border border-slate-300'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
          <Sun
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-20 text-slate-400' : 'opacity-100 text-amber-500'
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-100 text-indigo-300' : 'opacity-20 text-slate-400'
            }`}
          />
        </div>
        <span
          className={`relative z-10 flex h-5.5 w-5.5 transform items-center justify-center rounded-full shadow-xs transition-transform duration-200 ${
            isDark
              ? 'translate-x-6 bg-slate-800 text-indigo-300 border border-slate-600'
              : 'translate-x-0.5 bg-white text-amber-500 border border-slate-200'
          }`}
        >
          {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
        </span>
      </div>
    </button>
  );
};
