# Skycast: Weather App

A responsive weather dashboard built with React and Vite, powered by the [OpenWeather API](https://openweathermap.org/api).

## Features

- **City search**, plus a **"use my location"** option through the browser Geolocation API
- **Current conditions**: temperature, description, today's high and low, and the city's local date and time
- **Next 24 hours** in 3-hour steps, with the chance of rain
- **5-day forecast** with temperature range bars scaled across the week
- **Today's highlights**: feels-like, humidity, wind speed and direction, pressure, visibility, sunrise and sunset
- **Background that follows the weather**: the gradient and animated glass blobs change with the conditions (clear, cloudy, rain, storm, snow, mist) and with day or night
- **°C / °F toggle**. The chosen unit and the last city you searched are saved in local storage.
- Loading skeletons and clear error messages (unknown city, network failure, denied location access)
- Mobile-first responsive layout, keyboard accessible, and respects `prefers-reduced-motion`

## Tech stack

React 18 · Vite 5 · Font Awesome · plain CSS (glassmorphism, CSS custom properties for theming)

## Getting started

1. Get a free API key from [openweathermap.org](https://home.openweathermap.org/api_keys).
2. Copy the example env file and add your key:

   ```bash
   cp .env.example .env
   # then edit .env → VITE_APP_ID=your_key_here
   ```

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

| Script            | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

## Project structure

```
src/
├── api/weather.js          # API requests, response parsing, weather → theme mapping
├── utils/format.js         # Unit conversion and local time formatting
└── components/
    ├── Weather.jsx         # Page shell, state, data loading
    ├── SearchBar.jsx
    ├── CurrentWeather.jsx
    ├── HourlyForecast.jsx
    ├── WeatherDetails.jsx
    ├── DailyForecast.jsx
    └── Weather.css
```

## Deploying

When you deploy (Vercel, Netlify and similar hosts), set `VITE_APP_ID` as an environment variable in the host's dashboard. Vite builds the key into the client bundle, so use a free-tier key that is only used for this app.
