import {
  AssetName,
  AssetsConfig,
  EquityCaps,
  AllocationResult,
  ProjectionResult,
  ProjectionYearData,
} from '../types';
import { ASSETS_CONFIG, ASSET_ORDER } from './assetsConfig';

// Deterministic Pseudo-Random Number Generator (Mulberry32) for reproducible Monte Carlo simulations
function createSeededRandom(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller Transform for generating normal standard distribution samples
function createNormalGenerator(rng: () => number) {
  let spare: number | null = null;
  return function (mean = 0, stdDev = 1): number {
    if (spare !== null) {
      const val = spare;
      spare = null;
      return mean + val * stdDev;
    }
    let u = 0;
    let v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    const mag = Math.sqrt(-2.0 * Math.log(u));
    spare = mag * Math.sin(2.0 * Math.PI * v);
    return mean + mag * Math.cos(2.0 * Math.PI * v) * stdDev;
  };
}

// Percentile calculation helper matching numpy.percentile
function getPercentile(arr: number[], percentile: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export class InvestmentEngine {
  private config: AssetsConfig;

  constructor(config: AssetsConfig = ASSETS_CONFIG) {
    this.config = config;
  }

  public getConfig(): AssetsConfig {
    return this.config;
  }

  public getEquityCaps(risk: number, horizonYears: number): EquityCaps {
    const clampedRisk = Math.max(1, Math.min(5, Math.floor(risk)));

    let risk_cap = 0.8;
    if (clampedRisk <= 2) {
      risk_cap = 0.25;
    } else if (clampedRisk === 3) {
      risk_cap = 0.45;
    } else if (clampedRisk === 4) {
      risk_cap = 0.7;
    } else {
      risk_cap = 0.8;
    }

    let horizon_cap = 0.8;
    if (horizonYears < 2) {
      horizon_cap = 0.15;
    } else if (horizonYears < 3) {
      horizon_cap = 0.25;
    } else if (horizonYears < 5) {
      horizon_cap = 0.4;
    } else if (horizonYears < 7) {
      horizon_cap = 0.55;
    } else {
      horizon_cap = 0.8;
    }

    const equity_cap_total = Math.min(risk_cap, horizon_cap);
    return { risk_cap, horizon_cap, equity_cap_total };
  }

  public validateInputs(
    amount: number,
    horizonYears: number,
    risk: number,
    liquidityPct: number
  ): string[] {
    const warnings: string[] = [];
    if (amount <= 0) {
      warnings.push('Investment amount must be greater than 0.');
    }
    if (horizonYears <= 0) {
      warnings.push('Duration must be greater than 0 years.');
    }
    if (risk < 1 || risk > 5) {
      warnings.push('Risk tolerance should be between 1 (Low) and 5 (High).');
    }
    if (liquidityPct < 0 || liquidityPct > 100) {
      warnings.push('Liquidity need should be between 0% and 100%.');
    }
    if (risk >= 4 && horizonYears < 2) {
      warnings.push(
        'Conflict: High risk with very short horizon. Equity is capped for capital preservation.'
      );
    }
    if (liquidityPct > 80 && horizonYears >= 5) {
      warnings.push('Note: High liquidity need limits long-term growth potential.');
    }
    return warnings;
  }

  public allocate(
    amount: number,
    horizonYears: number,
    risk: number,
    liquidityPct: number
  ): AllocationResult {
    const warnings = this.validateInputs(amount, horizonYears, risk, liquidityPct);
    const clampedLiquidity = Math.max(0, Math.min(100, Number(liquidityPct)));
    const caps = this.getEquityCaps(risk, horizonYears);
    const eqCap = caps.equity_cap_total;

    const alloc: Record<AssetName, number> = {
      'Liquid / Cash': 0,
      'Bonds / FDs': 0,
      'Large-cap Equity': 0,
      'Mid-cap Equity': 0,
      Gold: 0,
    };

    if (amount <= 0) {
      const allocRupees = { ...alloc };
      return {
        amount,
        horizon_years: horizonYears,
        risk,
        liquidity_pct: clampedLiquidity,
        equity_cap_total: eqCap,
        caps,
        allocation_pct: alloc,
        allocation_rupees: allocRupees,
        warnings,
        explanation: 'Invalid amount.',
      };
    }

    alloc['Liquid / Cash'] = clampedLiquidity;
    const remPct = 100.0 - clampedLiquidity;

    if (remPct <= 0) {
      const allocRupees = {
        'Liquid / Cash': amount * (alloc['Liquid / Cash'] / 100.0),
        'Bonds / FDs': 0,
        'Large-cap Equity': 0,
        'Mid-cap Equity': 0,
        Gold: 0,
      };
      return {
        amount,
        horizon_years: horizonYears,
        risk,
        liquidity_pct: clampedLiquidity,
        equity_cap_total: eqCap,
        caps,
        allocation_pct: alloc,
        allocation_rupees: allocRupees,
        warnings,
        explanation: 'All funds reserved in liquid/cash due to high liquidity need.',
      };
    }

    let bondsTarget = Math.min(40.0, Math.max(10.0, 30.0 - risk * 5.0));
    let goldTarget = Math.min(15.0, Math.max(5.0, 10.0)); // 10.0
    let equityTotalPct = remPct - bondsTarget - goldTarget;

    if (equityTotalPct < 0) {
      equityTotalPct = 0.0;
    }
    if (equityTotalPct > eqCap * 100.0) {
      equityTotalPct = eqCap * 100.0;
    }

    const s = bondsTarget + goldTarget + equityTotalPct;
    if (s > remPct) {
      const scale = remPct / s;
      bondsTarget *= scale;
      goldTarget *= scale;
      equityTotalPct *= scale;
    } else if (s < remPct) {
      bondsTarget += remPct - s;
    }

    let largeEq = 0;
    let midEq = 0;
    if (equityTotalPct > 0) {
      largeEq = equityTotalPct * 0.7;
      midEq = equityTotalPct * 0.3;
    }

    alloc['Bonds / FDs'] = bondsTarget;
    alloc['Large-cap Equity'] = largeEq;
    alloc['Mid-cap Equity'] = midEq;
    alloc['Gold'] = goldTarget;

    const total = Object.values(alloc).reduce((acc, v) => acc + v, 0);
    if (total > 0) {
      for (const k of ASSET_ORDER) {
        alloc[k] = (alloc[k] * 100.0) / total;
      }
    }

    const allocRupees: Record<AssetName, number> = {
      'Liquid / Cash': amount * (alloc['Liquid / Cash'] / 100.0),
      'Bonds / FDs': amount * (alloc['Bonds / FDs'] / 100.0),
      'Large-cap Equity': amount * (alloc['Large-cap Equity'] / 100.0),
      'Mid-cap Equity': amount * (alloc['Mid-cap Equity'] / 100.0),
      Gold: amount * (alloc['Gold'] / 100.0),
    };

    const explanation = `Liquidity of ${clampedLiquidity.toFixed(
      0
    )}% reserved first in Liquid/Cash. Equity capped at ${(eqCap * 100).toFixed(
      0
    )}% of total (lower of risk cap ${(caps.risk_cap * 100).toFixed(
      0
    )}% and horizon cap ${(caps.horizon_cap * 100).toFixed(
      0
    )}%). Remainder split across bonds, equity (large/mid) and gold with stability bias.`;

    return {
      amount,
      horizon_years: horizonYears,
      risk,
      liquidity_pct: clampedLiquidity,
      equity_cap_total: eqCap,
      caps,
      allocation_pct: alloc,
      allocation_rupees: allocRupees,
      warnings,
      explanation,
    };
  }

  public project(
    allocationPct: Record<AssetName, number>,
    horizonYears: number,
    amount = 200000,
    nSims = 1000
  ): ProjectionResult {
    const horizon = Math.max(0.0001, Number(horizonYears));

    const w: number[] = [];
    const rets: number[] = [];
    const vols: number[] = [];

    for (const k of ASSET_ORDER) {
      const asset = this.config.assets[k];
      if (!asset) continue;
      w.push((Number(allocationPct[k]) || 0) / 100.0);
      rets.push(Number(asset.expected_return));
      vols.push(Number(asset.volatility));
    }

    const wSum = w.reduce((acc, v) => acc + v, 0);
    let portRet = 0;
    let portVol = 0;

    if (wSum > 0) {
      const normalizedW = w.map((v) => v / wSum);
      portRet = normalizedW.reduce((sum, wi, i) => sum + wi * rets[i], 0);
      const variance = normalizedW.reduce((sum, wi, i) => sum + wi * wi * vols[i] * vols[i], 0);
      portVol = Math.sqrt(Math.max(variance, 0));
    }

    // Scenarios (Pessimistic: ret - vol, Base: ret, Optimistic: ret + vol)
    const pessimisticDr = portRet - portVol;
    const baseDr = portRet;
    const optimisticDr = portRet + portVol;

    const pessimisticFv = Math.pow(1 + pessimisticDr, horizon);
    const baseFv = Math.pow(1 + baseDr, horizon);
    const optimisticFv = Math.pow(1 + optimisticDr, horizon);

    // Monte Carlo simulation with reproducible seed 12345
    const rng = createSeededRandom(12345);
    const normalGen = createNormalGenerator(rng);
    const sims: number[] = [];

    const numYearsInt = Math.max(1, Math.round(horizon));
    for (let i = 0; i < nSims; i++) {
      let cum = 1.0;
      for (let y = 0; y < numYearsInt; y++) {
        const pathRet = normalGen(portRet, portVol);
        cum *= 1 + pathRet;
      }
      if (horizon % 1 !== 0) {
        cum *= 1 + normalGen(portRet, portVol);
      }
      sims.push(cum);
    }

    const p10 = getPercentile(sims, 10);
    const p50 = getPercentile(sims, 50);
    const p90 = getPercentile(sims, 90);

    const inflationAnnual = this.config.inflation_annual;
    const inflationDiscount = Math.pow(1 + inflationAnnual, horizon);
    const inflationAdjustedP50Multiple = p50 / inflationDiscount;

    // Yearly trajectory breakdown
    const yearlyProjection: ProjectionYearData[] = [];
    const maxYear = Math.max(1, Math.ceil(horizon));
    for (let yr = 0; yr <= maxYear; yr++) {
      const yearPessimistic = amount * Math.pow(1 + pessimisticDr, yr);
      const yearBase = amount * Math.pow(1 + baseDr, yr);
      const yearOptimistic = amount * Math.pow(1 + optimisticDr, yr);
      const yearInflation = amount * Math.pow(1 + inflationAnnual, yr);
      yearlyProjection.push({
        year: yr,
        pessimistic: Math.round(yearPessimistic),
        base: Math.round(yearBase),
        optimistic: Math.round(yearOptimistic),
        inflationBenchmark: Math.round(yearInflation),
      });
    }

    return {
      portfolio_expected_return: portRet,
      portfolio_volatility: portVol,
      inflation_annual: inflationAnnual,
      scenarios: {
        pessimistic: {
          fv_multiple: pessimisticFv,
          fv_per_unit: pessimisticFv,
          amount: amount * pessimisticFv,
        },
        base: {
          fv_multiple: baseFv,
          fv_per_unit: baseFv,
          amount: amount * baseFv,
        },
        optimistic: {
          fv_multiple: optimisticFv,
          fv_per_unit: optimisticFv,
          amount: amount * optimisticFv,
        },
      },
      monte_carlo: {
        n: nSims,
        p10,
        p50,
        p90,
      },
      inflation_adjusted_p50_multiple: inflationAdjustedP50Multiple,
      inflation_adjusted_p50_rupees: amount * inflationAdjustedP50Multiple,
      yearly_projection: yearlyProjection,
    };
  }
}
