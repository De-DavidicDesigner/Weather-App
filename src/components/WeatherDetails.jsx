import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faDroplet,
  faEye,
  faGauge,
  faMoon,
  faSun,
  faTemperatureHalf,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistance, formatTemp, formatTime, formatWind, UNITS, windDirection } from "../utils/format";

function Tile({ icon, label, value, unit, children }) {
  return (
    <div className="tile">
      <span className="tile-label">
        <FontAwesomeIcon icon={icon} /> {label}
      </span>
      <span className="tile-value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {children && <span className="tile-note">{children}</span>}
    </div>
  );
}

export default function WeatherDetails({ current, unit }) {
  const u = UNITS[unit];
  const feelsDiff = Math.round(current.feelsLike - current.temp);

  return (
    <section className="card" aria-labelledby="details-title">
      <h2 id="details-title" className="card-title">Today&apos;s highlights</h2>
      <div className="tiles">
        <Tile icon={faTemperatureHalf} label="Feels like" value={`${formatTemp(current.feelsLike, unit)}°`}>
          {feelsDiff === 0 ? "Same as actual" : feelsDiff > 0 ? "Warmer than actual" : "Cooler than actual"}
        </Tile>

        <Tile icon={faDroplet} label="Humidity" value={current.humidity} unit="%">
          <span className="meter">
            <span style={{ width: `${current.humidity}%` }} />
          </span>
        </Tile>

        <Tile icon={faWind} label="Wind" value={formatWind(current.windSpeed, unit)} unit={u.wind}>
          <FontAwesomeIcon icon={faArrowUp} style={{ transform: `rotate(${(current.windDeg ?? 0) + 180}deg)` }} />{" "}
          {windDirection(current.windDeg)}
        </Tile>

        <Tile icon={faGauge} label="Pressure" value={current.pressure} unit="hPa" />

        <Tile icon={faEye} label="Visibility" value={formatDistance(current.visibility ?? 10000, unit)} unit={u.distance} />

        <div className="tile sun">
          <span className="tile-label">
            <FontAwesomeIcon icon={faSun} /> Sunrise
          </span>
          <span className="tile-value small">{formatTime(current.sunrise, current.timezone)}</span>
          <span className="tile-label">
            <FontAwesomeIcon icon={faMoon} /> Sunset
          </span>
          <span className="tile-value small">{formatTime(current.sunset, current.timezone)}</span>
        </div>
      </div>
    </section>
  );
}
