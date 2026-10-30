import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-slate-200/80 dark:border-slate-800 pt-6 pb-10 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 transition-colors">
      <div className="flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500">
        <ShieldCheck className="w-4 h-4" />
        <span>Indian Financial Assets Allocation Framework</span>
      </div>
      <p className="max-w-3xl mx-auto px-4 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
        Disclaimer: Projections are illustrative and are not financial advice. Past performance does not predict future returns. Mutual fund and ETF investments are subject to market risks; read all scheme related documents carefully.
      </p>
    </footer>
  );
};
