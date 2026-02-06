/**
 * Format a number as USD currency string.
 */
export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format a number with + or - prefix for display.
 */
export function formatChange(value: number): string {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

/**
 * Format a percentage value.
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
