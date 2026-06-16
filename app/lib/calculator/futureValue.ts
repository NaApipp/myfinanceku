export function calculateFutureValue(
  monthlyContribution: number,
  annualRate: number,
  years: number,
  initialAmount: number = 0,
) {
  const r = annualRate / 100 / 12;
  const n = years * 12;

  // Future value dari kontribusi rutin
  const fvContributions =
    r === 0
      ? monthlyContribution * n
      : (monthlyContribution * (Math.pow(1 + r, n) - 1)) / r;

  // Future value dari modal awal
  const fvInitial = initialAmount * Math.pow(1 + r, n);

  const totalFV = fvContributions + fvInitial;
  const totalInvested = monthlyContribution * n + initialAmount;

  return {
    finalAmount: totalFV,
    totalInvested,
    totalGain: totalFV - totalInvested,
  };
}
