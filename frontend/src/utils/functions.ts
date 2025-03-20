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

export function summarizeText(
  text: string,
  maxSize: number = 233
): string {
  // Split the text into words
  const words = text.split(/\s+/);

  // If the entire text is already short enough, return it as-is
  if (text.length <= maxSize) {
    return text;
  }

  // Calculate how many words to take from the start, middle, and end
  const firstPartSize = Math.floor(maxSize * 0.3);
  const middlePartSize = Math.floor(maxSize * 0.2);
  const endPartSize = Math.floor(maxSize * 0.3);

  // Get the first words
  const firstWords = words.slice(0, firstPartSize).join(' ');

  // Get the middle words
  const middleIndex = Math.floor(words.length / 2);
  const middleWords = words.slice(middleIndex, middleIndex + middlePartSize).join(' ');

  // Get the last words
  const lastWords = words.slice(-endPartSize).join(' ');

  // Concatenate with ellipses
  const summary = `${firstWords} ... ${middleWords} ... ${lastWords}`;

  // Ensure that the summary does not exceed the maxSize
  return summary.length > maxSize
    ? summary.slice(0, maxSize - 3) + '...' // Truncate if necessary
    : summary;
}