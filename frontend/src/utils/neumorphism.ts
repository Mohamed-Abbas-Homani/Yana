type RGB = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex: string): RGB {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}

function adjustBrightness(color: RGB, percent: number): string {
  const r = Math.max(0, Math.min(255, Math.floor(color.r * (1 + percent / 100))));
  const g = Math.max(0, Math.min(255, Math.floor(color.g * (1 + percent / 100))));
  const b = Math.max(0, Math.min(255, Math.floor(color.b * (1 + percent / 100))));
  return `rgb(${r},${g},${b})`;
}

function generateNeumo(hexColor: string): { borderRadius: string; background: string; boxShadow: string } {
  const rgbColor = hexToRgb(hexColor);
  const shadowColorDown = adjustBrightness(rgbColor, -8.5); // Decrease by 8.5%
  const shadowColorUp = adjustBrightness(rgbColor, 8.5); // Increase by 8.5%

  return {
    borderRadius: "5px",
    background: hexColor,
    boxShadow: `5px 5px 13px ${shadowColorDown}, -5px -5px 13px ${shadowColorUp}`
  };
}
