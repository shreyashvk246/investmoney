import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

interface ExplanationSectionProps {
  explanation: string;
  warnings: string[];
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  explanation,
  warnings,
}) => {
  return (
    <section className="rounded-2xl border transition-colors duration-200 p-5 flex flex-col gap-3.5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
        Explanation
      </h3>

      {/* Primary explanation (st.info) */}
      <div className="flex items-start gap-3 rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed border transition-colors bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/90 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <p className="font-medium">{explanation}</p>
      </div>

      {/* Warnings (st.warning) */}
      {warnings && warnings.length > 0 && (
        <div className="flex flex-col gap-2">
          {warnings.map((w, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl p-3 text-xs sm:text-sm leading-relaxed border transition-colors bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-900 dark:text-amber-200"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
