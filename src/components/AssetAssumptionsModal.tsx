import React from 'react';
import { ASSETS_CONFIG, ASSET_ORDER, getAssetColor } from '../engine/assetsConfig';
import { formatPercent } from '../utils/formatters';
import { X, Database, Info } from 'lucide-react';

interface AssetAssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetAssumptionsModal: React.FC<AssetAssumptionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-5 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Asset Class Assumptions & Correlation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Derived from historical monthly data (LiquidBees, GiltBees, Nifty 50, Nifty Midcap 50, GoldBees)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assets Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Asset Class Parameters
          </h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Proxy Instrument</th>
                  <th className="py-2.5 px-3 text-right">Expected Return (p.a.)</th>
                  <th className="py-2.5 px-3 text-right">Volatility (p.a.)</th>
                  <th className="py-2.5 px-3 text-center">Liquidity</th>
                  <th className="py-2.5 px-3 text-center">Min Horizon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {ASSET_ORDER.map((name) => {
                  const a = ASSETS_CONFIG.assets[name];
                  const color = getAssetColor(name);
                  return (
                    <tr key={name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {a.proxy}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-white">
                        {formatPercent(a.expected_return * 100, 2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-600 dark:text-slate-300">
                        {formatPercent(a.volatility * 100, 2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="capitalize text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {a.liquidity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                        {a.min_horizon_years} {a.min_horizon_years === 1 ? 'yr' : 'yrs'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correlation Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Correlation Matrix
          </h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3 text-left">Asset</th>
                  {ASSET_ORDER.map((k) => (
                    <th key={k} className="py-2.5 px-2 text-[10px]">
                      {k.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px]">
                {ASSET_ORDER.map((rowName) => (
                  <tr key={rowName}>
                    <td className="py-2 px-3 text-left font-semibold text-slate-800 dark:text-slate-200 font-sans">
                      {rowName}
                    </td>
                    {ASSET_ORDER.map((colName) => {
                      const corrVal = ASSETS_CONFIG.correlation[rowName]?.[colName] ?? (rowName === colName ? 1 : 0);
                      const isSelf = rowName === colName;
                      const isHigh = corrVal > 0.5;
                      const isNegative = corrVal < -0.05;

                      return (
                        <td
                          key={colName}
                          className={`py-2 px-2 ${
                            isSelf
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold'
                              : isHigh
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                              : isNegative
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {corrVal.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inflation & Note */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Inflation Baseline: {formatPercent(ASSETS_CONFIG.inflation_annual * 100, 1)} p.a.
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">{ASSETS_CONFIG.source_note}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
