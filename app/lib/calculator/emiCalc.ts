export function calculateEMI(
  principal: number,
  annualRate: number,
  months: number,
) {
  const r = annualRate / 100 / 12;

  if (r === 0)
    return {
      emi: principal / months,
      totalPayment: principal,
      totalInterest: 0,
    };

  const emi =
    (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return { emi, totalPayment, totalInterest };
}
