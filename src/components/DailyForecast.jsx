import { iconUrl } from "../api/weather";
import { formatLocal, formatTemp } from "../utils/format";

export default function DailyForecast({ days, timezone, unit }) {
  // Scale each day's temperature bar against the whole week's range.
  const weekMin = Math.min(...days.map((d) => d.min));
  const weekMax = Math.max(...days.map((d) => d.max));
  const span = weekMax - weekMin || 1;

  return (
    <section className="card daily-card" aria-labelledby="daily-title">
      <h2 id="daily-title" className="card-title">5-day forecast</h2>
      <ul className="daily">
        {days.map((day, i) => (
          <li key={day.dt} className="day">
            <span className="day-name">{i === 0 ? "Today" : formatLocal(day.dt, timezone, { weekday: "short" })}</span>
            <img src={iconUrl(day.icon)} alt={day.description} width="44" height="44" />
            <span className="day-desc">{day.description}</span>
            <span className="day-min">{formatTemp(day.min, unit)}°</span>
            <span className="range" aria-hidden="true">
              <span
                style={{
                  left: `${((day.min - weekMin) / span) * 100}%`,
                  right: `${((weekMax - day.max) / span) * 100}%`,
                }}
              />
            </span>
            <span className="day-max">{formatTemp(day.max, unit)}°</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
