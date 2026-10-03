import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUmbrella } from "@fortawesome/free-solid-svg-icons";
import { iconUrl } from "../api/weather";
import { formatLocal, formatTemp } from "../utils/format";

export default function HourlyForecast({ hours, timezone, unit }) {
  return (
    <section className="card" aria-labelledby="hourly-title">
      <h2 id="hourly-title" className="card-title">Next 24 hours</h2>
      <ol className="hourly">
        {hours.map((hour, i) => (
          <li key={hour.dt} className="hour">
            <span className="hour-time">{i === 0 ? "Now" : formatLocal(hour.dt, timezone, { hour: "numeric" })}</span>
            <img src={iconUrl(hour.icon)} alt={hour.description} width="48" height="48" />
            <span className="hour-temp">{formatTemp(hour.temp, unit)}°</span>
            <span className={`pop ${hour.pop >= 0.1 ? "" : "pop-hidden"}`}>
              <FontAwesomeIcon icon={faUmbrella} /> {Math.round(hour.pop * 100)}%
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
