import React from 'react';
import { AllocationResult } from '../types';
import { ASSET_ORDER, ASSETS_CONFIG, getAssetColor } from '../engine/assetsConfig';
import { formatINR, formatPercent } from '../utils/formatters';
import { DonutChart } from './DonutChart';
import { PieChart } from 'lucide-react';

interface AllocationViewProps {
  result: AllocationResult;
}

export const AllocationView: React.FC<AllocationViewProps> = ({ result }) => {
  const tableRows = ASSET_ORDER.map((k) => {
    const pct = result.allocation_pct[k] || 0;
    const rupees = result.allocation_rupees[k] || 0;
    const details = ASSETS_CONFIG.assets[k];
    const color = getAssetColor(k);
    return {
      asset: k,
      pct,
      rupees,
      color,
      proxy: details.proxy,
      minHorizon: details.min_horizon_years,
      expectedReturn: details.expected_return,
    };
  }).filter((row) => row.pct > 0.01);

  const totalRupees = tableRows.reduce((acc, r) => acc + r.rupees, 0);
  const totalPct = tableRows.reduce((acc, r) => acc + r.pct, 0);

  return (
    <div className="rounded-2xl border transition-colors duration-200 p-5 flex flex-col gap-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
            Recommended Allocation
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
          {tableRows.length} Active Assets
        </span>
      </div>

      {/* Table matching st.dataframe(alloc_df) */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="py-2.5 px-3">Asset</th>
              <th className="py-2.5 px-3 text-right">Allocation %</th>
              <th className="py-2.5 px-3 text-right">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
            {tableRows.map((row) => (
              <tr
                key={row.asset}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <td className="py-2.5 px-3 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {row.asset}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-slate-500 line-clamp-1">
                      {row.proxy}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-slate-300">
                  {formatPercent(row.pct, 2)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold font-mono text-slate-900 dark:text-white">
                  {formatINR(row.rupees)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800">
              <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Total</td>
              <td className="py-2 px-3 text-right text-blue-700 dark:text-blue-400">
                {formatPercent(totalPct, 1)}
              </td>
              <td className="py-2 px-3 text-right font-mono text-blue-700 dark:text-blue-400">
                {formatINR(totalRupees)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Donut chart */}
      <div className="pt-2">
        <DonutChart
          slices={tableRows.map((r) => ({
            asset: r.asset,
            pct: r.pct,
            rupees: r.rupees,
            color: r.color,
          }))}
          totalAmount={result.amount}
        />
      </div>
    </div>
  );
};
