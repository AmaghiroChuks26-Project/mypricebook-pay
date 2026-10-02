export function formatMoney(amountKobo: number): string {
  return `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amountKobo / 100)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value);
}