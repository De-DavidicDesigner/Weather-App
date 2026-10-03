import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { iconUrl } from "../api/weather";
import { formatLocal, formatTemp, UNITS } from "../utils/format";

export default function CurrentWeather({ current, today, unit }) {
  const high = Math.max(today?.max ?? current.temp, current.temp);
  const low = Math.min(today?.min ?? current.temp, current.temp);

  return (
    <section className="card hero" aria-label="Current weather">
      <div className="hero-head">
        <h1 className="city">
          <FontAwesomeIcon icon={faLocationDot} />
          {current.city}
          {current.country && <span className="country">{current.country}</span>}
        </h1>
        <p className="date">
          {formatLocal(current.dt, current.timezone, { weekday: "long", day: "numeric", month: "long" })}
          {" · "}
          {formatLocal(Date.now() / 1000, current.timezone, { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>

      <img className="hero-icon" src={iconUrl(current.icon, 4)} alt="" width="180" height="180" />

      <div className="hero-temp">
        {formatTemp(current.temp, unit)}
        <span className="hero-unit">{UNITS[unit].temp}</span>
      </div>
      <p className="condition">{current.description}</p>
      <p className="hilo">
        <span>H: {formatTemp(high, unit)}°</span>
        <span>L: {formatTemp(low, unit)}°</span>
      </p>
    </section>
  );
}
