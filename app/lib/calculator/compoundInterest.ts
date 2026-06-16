export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  compoundingFrequency: number, // 12 = monthly
  years: number,
) {
  const r = annualRate / 100;
  const amount =
    principal *
    Math.pow(1 + r / compoundingFrequency, compoundingFrequency * years);
  const interest = amount - principal;

  return { finalAmount: amount, totalInterest: interest };
}
