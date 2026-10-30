export type AssetName =
  | 'Liquid / Cash'
  | 'Bonds / FDs'
  | 'Large-cap Equity'
  | 'Mid-cap Equity'
  | 'Gold';

export interface AssetDetails {
  expected_return: number;
  volatility: number;
  liquidity: 'high' | 'medium' | 'low';
  min_horizon_years: number;
  proxy: string;
  description: string;
  color: string;
}

export interface AssetsConfig {
  inflation_annual: number;
  assets: Record<AssetName, AssetDetails>;
  correlation: Record<AssetName, Record<AssetName, number>>;
  source_note: string;
}

export interface EquityCaps {
  risk_cap: number;
  horizon_cap: number;
  equity_cap_total: number;
}

export interface AllocationResult {
  amount: number;
  horizon_years: number;
  risk: number;
  liquidity_pct: number;
  equity_cap_total: number;
  caps?: EquityCaps;
  allocation_pct: Record<AssetName, number>;
  allocation_rupees: Record<AssetName, number>;
  warnings: string[];
  explanation: string;
}

export interface ScenarioDetail {
  fv_multiple: number;
  fv_per_unit: number;
  amount: number;
}

export interface MonteCarloResult {
  n: number;
  p10: number;
  p50: number;
  p90: number;
}

export interface ProjectionYearData {
  year: number;
  pessimistic: number;
  base: number;
  optimistic: number;
  inflationBenchmark: number;
}

export interface ProjectionResult {
  portfolio_expected_return: number;
  portfolio_volatility: number;
  inflation_annual: number;
  scenarios: {
    pessimistic: ScenarioDetail;
    base: ScenarioDetail;
    optimistic: ScenarioDetail;
  };
  monte_carlo: MonteCarloResult;
  inflation_adjusted_p50_multiple: number;
  inflation_adjusted_p50_rupees: number;
  yearly_projection: ProjectionYearData[];
}
