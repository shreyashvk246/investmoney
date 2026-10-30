import React, { useState, useMemo, useEffect } from 'react';
import { InvestmentEngine } from './engine/investmentEngine';
import { Header } from './components/Header';
import { SidebarInputs } from './components/SidebarInputs';
import { AllocationView } from './components/AllocationView';
import { ProjectionView } from './components/ProjectionView';
import { ExplanationSection } from './components/ExplanationSection';
import { AssetAssumptionsModal } from './components/AssetAssumptionsModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Input states with defaults matching Streamlit app.py
  const [amount, setAmount] = useState<number>(200000);
  const [horizonYears, setHorizonYears] = useState<number>(10);
  const [risk, setRisk] = useState<number>(3);
  const [liquidityPct, setLiquidityPct] = useState<number>(10);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState<boolean>(false);

  // Dark theme state with persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme_dark');
      if (saved !== null) {
        return saved === 'true';
      }
      return (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('theme_dark', String(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  // Engine instance
  const engine = useMemo(() => new InvestmentEngine(), []);

  // Allocation calculation
  const allocationResult = useMemo(() => {
    return engine.allocate(amount, horizonYears, risk, liquidityPct);
  }, [engine, amount, horizonYears, risk, liquidityPct]);

  // Projection calculation
  const projectionResult = useMemo(() => {
    return engine.project(allocationResult.allocation_pct, horizonYears, amount);
  }, [engine, allocationResult.allocation_pct, horizonYears, amount]);

  const handleReset = () => {
    setAmount(200000);
    setHorizonYears(10);
    setRisk(3);
    setLiquidityPct(10);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        isDark={isDark}
        onToggleDark={toggleDark}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Main layout: Sidebar on left (or top on mobile), 2 Columns on right */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Sidebar Inputs */}
          <SidebarInputs
            amount={amount}
            setAmount={setAmount}
            horizonYears={horizonYears}
            setHorizonYears={setHorizonYears}
            risk={risk}
            setRisk={setRisk}
            liquidityPct={liquidityPct}
            setLiquidityPct={setLiquidityPct}
            caps={allocationResult.caps}
            onReset={handleReset}
          />

          {/* Right Main Content (2 Columns + Explanation) */}
          <div className="flex-1 w-full flex flex-col gap-6">
            {/* 2 Columns: Col 1 Allocation, Col 2 Projections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {/* Column 1: Recommended Allocation */}
              <AllocationView result={allocationResult} />

              {/* Column 2: Projection (illustrative) */}
              <ProjectionView
                amount={amount}
                projection={projectionResult}
                horizonYears={horizonYears}
              />
            </div>

            {/* Explanation and Warnings */}
            <ExplanationSection
              explanation={allocationResult.explanation}
              warnings={allocationResult.warnings}
            />
          </div>
        </div>

        <Footer />
      </main>

      {/* Market Assumptions & Correlation Modal */}
      <AssetAssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
      />
    </div>
  );
};

export default App;
