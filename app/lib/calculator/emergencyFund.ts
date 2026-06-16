export function calculateEmergencyFund(
  monthlyExpenses: number,
  jobStability: "stable" | "moderate" | "unstable",
) {
  const multiplier = { stable: 3, moderate: 6, unstable: 12 };
  const recommended = monthlyExpenses * multiplier[jobStability];

  return { recommended, monthly: recommended / 12 };
}
