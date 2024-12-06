export const extractPrices = (pricing: string | null): [number, number] => {
  if (!pricing) return [NaN, NaN];

  const rangeMatch = pricing.match(
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*[-–]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/
  );

  if (rangeMatch) {
    const minPrice = parseFloat(rangeMatch[1].replace(",", ""));
    const maxPrice = parseFloat(rangeMatch[2].replace(",", ""));
    return [minPrice, maxPrice];
  }

  const fixedPriceMatch = pricing.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*฿/);

  if (fixedPriceMatch) {
    const price = parseFloat(fixedPriceMatch[1].replace(",", ""));
    return [price, price];
  }

  return [NaN, NaN];
};
