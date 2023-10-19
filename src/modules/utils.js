// Utility for restricting a value in between min and max (inclusive)
function clamp(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
}

export { clamp };