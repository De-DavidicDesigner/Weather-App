import "./Weather.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { fetchWeather, getTheme } from "../api/weather";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import HourlyForecast from "./HourlyForecast";
import WeatherDetails from "./WeatherDetails";
import DailyForecast from "./DailyForecast";

const DEFAULT_CITY = "Lome";

const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable, ignore */
    }
  },
};

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState(() => storage.get("unit") || "metric");
  const latestRequest = useRef(0);

  const load = useCallback(async (location) => {
    // Ignore responses from searches that have been superseded by a newer one.
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(location);
      if (requestId !== latestRequest.current) return;
      setWeather(data);
      storage.set("city", data.current.city);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(err instanceof TypeError ? "Network error. Check your connection and try again." : err.message);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(storage.get("city") || DEFAULT_CITY);
  }, [load]);

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => load({ lat: coords.latitude, lon: coords.longitude }),
      () => {
        setLoading(false);
        setError("Couldn't get your location. Allow location access or search for a city.");
      },
      { timeout: 10000 }
    );
  };

  const toggleUnit = () => {
    const next = unit === "metric" ? "imperial" : "metric";
    setUnit(next);
    storage.set("unit", next);
  };

  const theme = weather ? getTheme(weather.current.main, weather.current.icon) : "clear-night";

  return (
    <div className={`app theme-${theme}`}>
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      <main className="weather">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true" />
            Skycast
          </div>
          <SearchBar onSearch={load} onLocate={locate} loading={loading} />
          <button type="button" className="unit-toggle" onClick={toggleUnit} aria-label="Toggle temperature unit">
            <span className={unit === "metric" ? "active" : ""}>°C</span>
            <span className={unit === "imperial" ? "active" : ""}>°F</span>
          </button>
        </header>

        {error && (
          <div className="alert" role="alert">
            <FontAwesomeIcon icon={faCircleExclamation} />
            {error}
          </div>
        )}

        {weather ? (
          <div className={`dashboard ${loading ? "is-loading" : ""}`} aria-busy={loading}>
            <CurrentWeather current={weather.current} today={weather.daily[0]} unit={unit} />
            <div className="side">
              <HourlyForecast hours={weather.hourly} timezone={weather.current.timezone} unit={unit} />
              <WeatherDetails current={weather.current} unit={unit} />
            </div>
            <DailyForecast days={weather.daily} timezone={weather.current.timezone} unit={unit} />
          </div>
        ) : (
          loading && <Skeleton />
        )}

        <footer className="footer">
          Data from{" "}
          <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
            OpenWeather
          </a>
        </footer>
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="dashboard" aria-busy="true" aria-label="Loading weather">
      <div className="card skeleton hero-skeleton" />
      <div className="side">
        <div className="card skeleton" style={{ height: 170 }} />
        <div className="card skeleton" style={{ height: 260 }} />
      </div>
      <div className="card skeleton daily-skeleton" />
    </div>
  );
}
