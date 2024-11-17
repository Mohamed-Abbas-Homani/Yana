// utils/style.ts

/**
 * Updates a CSS variable with a new value.
 * @param variableName - The name of the CSS variable (e.g., '--background-color').
 * @param value - The new value (e.g., '#ff0000').
 */
export const updateCSSVariable = (
  variableName: string,
  value: string
): void => {
  // Update the CSS variable in the root element
  document.documentElement.style.setProperty(variableName, value);
};

/**
 * Increments or decrements a numeric CSS variable.
 * @param variableName - The name of the CSS variable (e.g., '--padding').
 * @param amount - The amount to increment or decrement (positive or negative number).
 */
export const adjustCSSVariable = (
  variableName: string,
  amount: number
): void => {
  // Get the current value of the CSS variable
  const currentValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  // Extract the numeric value and unit (assuming the value might have units like 'px', 'em', etc.)
  const numericValueMatch = currentValue.match(/^-?\d+(\.\d+)?/);
  const unitMatch = currentValue.match(/[a-zA-Z%]+$/);
  console.log(currentValue);
  if (!numericValueMatch) {
    console.error("CSS variable value must be numeric.");
    return;
  }

  const numericValue = parseFloat(numericValueMatch[0]);
  const unit = unitMatch ? unitMatch[0] : "";

  // Calculate the new value
  const newValue = numericValue + amount;

  // Update the CSS variable in the root element
  document.documentElement.style.setProperty(
    variableName,
    `${newValue}${unit}`
  );
};

/**
 * Gets the value of a CSS variable.
 * @param variableName - The name of the CSS variable (e.g., '--background-color').
 * @returns The value of the CSS variable.
 */
export const getCSSVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

/**
 * Generates a random integer between min and max, inclusive.
 * @param min - The minimum integer value.
 * @param max - The maximum integer value.
 * @returns A random integer between min and max.
 */
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random color in hexadecimal format.
 * @returns A random hex color string (e.g., '#a3e12f').
 */
export const getRandomHexColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Generates a random color in RGB format.
 * @returns A random RGB color string (e.g., 'rgb(123, 45, 67)').
 */
export const getRandomRgbColor = (): string => {
  const r = getRandomInt(0, 255);
  const g = getRandomInt(0, 255);
  const b = getRandomInt(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Generates a random color in HSL format.
 * @returns A random HSL color string (e.g., 'hsl(210, 100%, 50%)').
 */
export const getRandomHslColor = (): string => {
  const h = getRandomInt(0, 360);
  const s = getRandomInt(0, 100);
  const l = getRandomInt(0, 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
};
