// Gunakan pendekatan state machine, BUKAN eval() karena security risk
export type Operator = "+" | "-" | "*" | "/";

export interface CalcState {
  currentValue: string;
  previousValue: string;
  operator: Operator | null;
  shouldResetScreen: boolean;
}

export function calculate(
  prev: number,
  current: number,
  operator: Operator,
): number {
  switch (operator) {
    case "+":
      return prev + current;
    case "-":
      return prev - current;
    case "*":
      return prev * current;
    case "/":
      return current !== 0 ? prev / current : NaN;
  }
}
