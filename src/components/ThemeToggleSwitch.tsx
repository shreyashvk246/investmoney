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
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">
        {isDark ? 'Dark' : 'Light'}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark theme"
        onClick={onToggle}
        className={`relative inline-flex h-8 w-15 items-center rounded-full p-1 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer select-none ${
          isDark
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-slate-200 border border-slate-300'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
          <Sun
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-20 text-slate-500' : 'opacity-100 text-amber-500'
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-100 text-indigo-300' : 'opacity-20 text-slate-400'
            }`}
          />
        </div>
        <span
          className={`relative z-10 flex h-6 w-6 transform items-center justify-center rounded-full shadow-xs transition-transform duration-200 ${
            isDark
              ? 'translate-x-7 bg-slate-900 text-indigo-300 border border-slate-700'
              : 'translate-x-0 bg-white text-amber-500 border border-slate-200'
          }`}
        >
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </span>
      </button>
    </div>
  );
};
