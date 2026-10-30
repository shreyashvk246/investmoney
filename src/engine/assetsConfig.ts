import { AssetsConfig, AssetName } from '../types';

export const ASSET_ORDER: AssetName[] = [
  'Liquid / Cash',
  'Bonds / FDs',
  'Large-cap Equity',
  'Mid-cap Equity',
  'Gold',
];

export const ASSETS_CONFIG: AssetsConfig = {
  inflation_annual: 0.06,
  assets: {
    'Liquid / Cash': {
      expected_return: 0.03570384003349525,
      volatility: 0.004359263034875132,
      liquidity: 'high',
      min_horizon_years: 0,
      proxy: 'Nippon India ETF Liquid BeES (LIQUIDBEES)',
      description: 'Ultra-short term money market instruments for emergency and 1-year liquidity needs.',
      color: '#3b82f6', // blue-500
    },
    'Bonds / FDs': {
      expected_return: 0.05151838885049265,
      volatility: 0.03277666560673641,
      liquidity: 'medium',
      min_horizon_years: 1,
      proxy: 'Nippon India ETF Long Term Gilt (GILTBEES)',
      description: 'Government securities, sovereign debt & fixed deposits providing predictable stability.',
      color: '#10b981', // emerald-500
    },
    'Large-cap Equity': {
      expected_return: 0.0834887426746096,
      volatility: 0.15981623919388233,
      liquidity: 'high',
      min_horizon_years: 5,
      proxy: 'Nifty 50 Index (NIFTY 50)',
      description: 'Top 50 Indian bluechip companies with proven market leadership and compounding.',
      color: '#6366f1', // indigo-500
    },
    'Mid-cap Equity': {
      expected_return: 0.13881978082116309,
      volatility: 0.22201244569550876,
      liquidity: 'high',
      min_horizon_years: 7,
      proxy: 'Nifty Midcap 50 Index (NIFTY MIDCAP 50)',
      description: 'High-growth emerging Indian enterprises offering high upside with higher volatility.',
      color: '#8b5cf6', // purple-500
    },
    'Gold': {
      expected_return: 0.1364387236295661,
      volatility: 0.14893008514805736,
      liquidity: 'high',
      min_horizon_years: 3,
      proxy: 'Nippon India ETF Gold BeES (GOLDBEES)',
      description: 'Physical gold ETF serving as an inflation hedge and geopolitical crisis diversifier.',
      color: '#f59e0b', // amber-500
    },
  },
  correlation: {
    'Liquid / Cash': {
      'Liquid / Cash': 1.0,
      'Bonds / FDs': -0.008747872755118681,
      'Large-cap Equity': 0.03532173652145761,
      'Mid-cap Equity': 0.019651742236806595,
      'Gold': -0.03322481876096285,
    },
    'Bonds / FDs': {
      'Liquid / Cash': -0.008747872755118681,
      'Bonds / FDs': 1.0,
      'Large-cap Equity': 0.11070124313984622,
      'Mid-cap Equity': 0.1558616175295952,
      'Gold': -0.037181061355677704,
    },
    'Large-cap Equity': {
      'Liquid / Cash': 0.03532173652145761,
      'Bonds / FDs': 0.11070124313984622,
      'Large-cap Equity': 1.0,
      'Mid-cap Equity': 0.8563539474025225,
      'Gold': -0.06614143524740258,
    },
    'Mid-cap Equity': {
      'Liquid / Cash': 0.019651742236806595,
      'Bonds / FDs': 0.1558616175295952,
      'Large-cap Equity': 0.8563539474025225,
      'Mid-cap Equity': 1.0,
      'Gold': -0.11471506293684136,
    },
    'Gold': {
      'Liquid / Cash': -0.03322481876096285,
      'Bonds / FDs': -0.037181061355677704,
      'Large-cap Equity': -0.06614143524740258,
      'Mid-cap Equity': -0.11471506293684136,
      'Gold': 1.0,
    },
  },
  source_note: 'Computed from monthly historical data via yfinance (LiquidBees, GiltBees, Nifty 50, Nifty Midcap 50, GoldBees).',
};

export function getAssetColor(name: AssetName): string {
  return ASSETS_CONFIG.assets[name]?.color || '#64748b';
}

