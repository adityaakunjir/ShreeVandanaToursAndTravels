export function demoTotal(
  adultPaise: number,
  depositPaise: number,
  adults: number,
) {
  if (
    ![adultPaise, depositPaise, adults].every(Number.isSafeInteger) ||
    adultPaise <= 0 ||
    depositPaise <= 0 ||
    depositPaise > adultPaise ||
    adults < 1 ||
    adults > 8
  )
    throw new Error('Invalid demo party or pricing.');
  const total = adultPaise * adults;
  const deposit = depositPaise * adults;
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(deposit))
    throw new Error('Demo total exceeds the supported range.');
  return { total, deposit, balance: total - deposit };
}
