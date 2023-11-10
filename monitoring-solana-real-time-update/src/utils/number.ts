export function formatNumber(
  number: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
) {
  return Intl.NumberFormat(locale, {
    maximumFractionDigits: 3,
    ...options,
  }).format(number);
}
