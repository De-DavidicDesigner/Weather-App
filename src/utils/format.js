export const UNITS = {
  metric: { temp: "°C", wind: "km/h", distance: "km" },
  imperial: { temp: "°F", wind: "mph", distance: "mi" },
};

export const formatTemp = (celsius, unit) => Math.round(unit === "imperial" ? (celsius * 9) / 5 + 32 : celsius);

// The API returns wind in m/s when using metric units.
export const formatWind = (ms, unit) => Math.round(unit === "imperial" ? ms * 2.23694 : ms * 3.6);

export const formatDistance = (meters, unit) => {
  const value = unit === "imperial" ? meters / 1609.34 : meters / 1000;
  return value >= 10 ? Math.round(value) : value.toFixed(1);
};

// Format a UNIX timestamp in the city's local time (timezone is an offset in seconds).
export const formatLocal = (unix, timezone, options) =>
  new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date((unix + timezone) * 1000));

export const formatTime = (unix, timezone) => formatLocal(unix, timezone, { hour: "numeric", minute: "2-digit" });

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const windDirection = (deg = 0) => DIRECTIONS[Math.round(deg / 45) % 8];
