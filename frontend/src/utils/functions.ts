/**
 * Creates a debounced function that delays invoking the provided function until after the specified delay.
 * @param func - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @returns The debounced function.
 */
export const debounce = (func: (...args: any[]) => void, delay: number): (...args: any[]) => void => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Creates a throttled function that only invokes the provided function at most once per specified time frame.
 * @param func - The function to throttle.
 * @param limit - The time frame in milliseconds.
 * @returns The throttled function.
 */
export const throttle = (func: (...args: any[]) => void, limit: number): (...args: any[]) => void => {
  let lastFunc: number;
  let lastRan: number;
  return (...args: any[]) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};