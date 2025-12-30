export const hasMaxDecimals = (num: number, maxDecimals: number = 2): boolean => {
  return num !== parseFloat(num.toFixed(Math.max(0, Math.min(maxDecimals, 4))));
};
