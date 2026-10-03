import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ onSearch, onLocate, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const city = query.trim();
    if (!city) return;
    onSearch(city);
    setQuery("");
  };

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label htmlFor="city-search" className="sr-only">
        Search for a city
      </label>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
      <input
        id="city-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city…"
        autoComplete="off"
      />
      <button type="submit" className="search-btn" disabled={loading || !query.trim()} aria-label="Search">
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Search"}
      </button>
      <button type="button" className="icon-btn" onClick={onLocate} aria-label="Use my location" title="Use my location">
        <FontAwesomeIcon icon={faLocationCrosshairs} />
      </button>
    </form>
  );
}
