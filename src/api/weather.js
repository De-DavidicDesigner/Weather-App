const API_KEY = import.meta.env.VITE_APP_ID;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function request(endpoint, params) {
  if (!API_KEY) {
    throw new Error("Missing API key. Add VITE_APP_ID to your .env file.");
  }

  const query = new URLSearchParams({ ...params, units: "metric", appid: API_KEY });
  const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 404) throw new Error("City not found. Check the spelling and try again.");
    if (response.status === 401) throw new Error("The weather API key is invalid or inactive.");
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

// Shift a UNIX timestamp into the city's local time, read back with UTC getters.
const localDate = (unix, timezone) => new Date((unix + timezone) * 1000);

function parseCurrent(data) {
  const [condition] = data.weather;
  return {
    city: data.name,
    country: data.sys.country,
    timezone: data.timezone,
    dt: data.dt,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    clouds: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    main: condition.main,
    description: condition.description,
    icon: condition.icon,
  };
}

function parseForecast(data, timezone) {
  const hourly = data.list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    pop: item.pop,
  }));

  const days = new Map();
  for (const item of data.list) {
    const date = localDate(item.dt, timezone);
    const key = date.toISOString().slice(0, 10);
    const day = days.get(key) ?? { dt: item.dt, min: Infinity, max: -Infinity, pop: 0, slots: [] };
    day.min = Math.min(day.min, item.main.temp_min);
    day.max = Math.max(day.max, item.main.temp_max);
    day.pop = Math.max(day.pop, item.pop);
    day.slots.push({ hour: date.getUTCHours(), icon: item.weather[0].icon, description: item.weather[0].description });
    days.set(key, day);
  }

  const daily = [...days.values()].slice(0, 5).map(({ slots, ...day }) => {
    // Use the slot closest to midday as the day's representative condition.
    const midday = slots.reduce((best, slot) => (Math.abs(slot.hour - 12) < Math.abs(best.hour - 12) ? slot : best));
    return { ...day, icon: midday.icon.replace("n", "d"), description: midday.description };
  });

  return { hourly, daily };
}

/** @param {string | {lat: number, lon: number}} location */
export async function fetchWeather(location) {
  const params = typeof location === "string" ? { q: location.trim() } : { lat: location.lat, lon: location.lon };
  const [current, forecast] = await Promise.all([request("weather", params), request("forecast", params)]);
  const parsed = parseCurrent(current);
  return { current: parsed, ...parseForecast(forecast, parsed.timezone) };
}

export const iconUrl = (code, size = 2) => `https://openweathermap.org/img/wn/${code}@${size}x.png`;

export function getTheme(main, icon) {
  const night = icon?.endsWith("n");
  switch (main) {
    case "Clear":
      return night ? "clear-night" : "clear-day";
    case "Clouds":
      return night ? "cloudy-night" : "cloudy";
    case "Rain":
    case "Drizzle":
      return "rain";
    case "Thunderstorm":
      return "storm";
    case "Snow":
      return "snow";
    default:
      return "mist";
  }
}
