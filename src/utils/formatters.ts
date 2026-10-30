export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export function formatINRCompact(val: number): string {
  if (isNaN(val)) return '₹0';
  const abs = Math.abs(val);
  if (abs >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  if (abs >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return formatINR(val);
}

export function formatPercent(val: number, decimals = 1): string {
  if (isNaN(val)) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatMultiple(val: number): string {
  if (isNaN(val)) return '0.00x';
  return `${val.toFixed(2)}x`;
}
