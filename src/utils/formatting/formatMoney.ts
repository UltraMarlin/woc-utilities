const numberFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export const formatEuro = (cents: number | null | undefined) => {
  return cents != null ? numberFormatter.format(cents / 100) : null;
};
