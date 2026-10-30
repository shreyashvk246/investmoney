# Interactive Investment Planning System

An interactive portfolio asset allocation and multi-scenario Monte Carlo growth projection planner for Indian financial markets, rewritten as a modern React application.

## Features

- **Dynamic Asset Allocation**: Allocates capital across 5 core Indian asset classes:
  - Liquid / Cash (Nippon India ETF Liquid BeES)
  - Bonds / FDs (Nippon India ETF Long Term Gilt)
  - Large-cap Equity (Nifty 50 Index)
  - Mid-cap Equity (Nifty Midcap 50 Index)
  - Gold (Nippon India ETF Gold BeES)
- **Dynamic Guardrails**: Implements risk-based and investment-duration-based equity caps with automatic capital preservation rules.
- **Liquidity Prioritization**: Immediate reservation of near-term capital needs within 1 year before asset distribution.
- **Monte Carlo Projections (1,000 paths)**: Computes P10, P50 (median), and P90 cumulative growth multiples with seeded reproducible simulations.
- **Scenario Analysis**: Side-by-side comparison of Pessimistic, Base (expected), and Optimistic returns alongside inflation (6.0% p.a.) benchmark.
- **Interactive Visualizations**:
  - Donut allocation chart with interactive hover hole breakdown.
  - Scenario comparison bar chart.
  - Compound growth trajectory curve across duration years.
- **Market Data & Assumptions**: Complete transparency into historical return averages, annualized volatilities, and the cross-asset correlation matrix.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

## Development

```bash
npm install
npm run dev
```

The application runs on `http://localhost:3000`.

## Production Build

```bash
npm run build
```

## Disclaimer

Projections are illustrative and are not financial advice. Mutual fund and ETF investments are subject to market risks; past performance does not guarantee future results.
