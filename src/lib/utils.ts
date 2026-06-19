export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number => {
  if (fromCurrency === toCurrency) return amount;

  const rateFrom = rates[fromCurrency.toLowerCase()];
  const rateTo = rates[toCurrency.toLowerCase()];

  if (!rateFrom || !rateTo) return amount;
  const converted = (amount / rateFrom) * rateTo;

  return parseFloat(converted.toFixed(2));
};
