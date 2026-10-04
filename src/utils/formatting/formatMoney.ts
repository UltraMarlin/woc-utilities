const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const euroFormatterFractionless = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const formatEuro = (
  cents: number | null | undefined,
  fractionless: boolean = false
) => {
  if (cents == null) return "";
  if (fractionless) return euroFormatterFractionless.format(cents / 100);
  return euroFormatter.format(cents / 100);
};
