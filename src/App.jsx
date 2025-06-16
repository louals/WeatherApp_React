// src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [unit, setUnit] = useState("metric");
  const [currentDate, setCurrentDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("default-bg");

  const cardRef = useRef(null);               // ⬅️ for the fade‑in anim
  const apiKey = "8bfa885b3600bdee69135e962d6c84f8";

  /* ---------------------------------- helpers ---------------------------------- */
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear": return "☀️";
      case "clouds": return "☁️";
      case "rain": return "🌧️";
      case "drizzle": return "🌦️";
      case "thunderstorm": return "⛈️";
      case "snow": return "❄️";
      case "mist":
      case "smoke":
      case "haze":
      case "fog": return "🌫️";
      default: return "🌤️";
    }
  };

  const getBgClass = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear": return "sunny-bg";
      case "clouds": return "cloudy-bg";
      case "rain":
      case "drizzle": return "rainy-bg";
      case "thunderstorm": return "stormy-bg";
      case "snow": return "snowy-bg";
      case "mist":
      case "smoke":
      case "haze":
      case "fog": return "foggy-bg";
      default: return "default-bg";
    }
  };

  /* ---------------------------------- API call --------------------------------- */
  const fetchWeatherData = () => {
    if (!location.trim()) {
      setErrorMessage("Please enter a location.");
      return;
    }

    setLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`
      )
      .then((res) => {
        const { weather } = res.data;
        const condition = weather[0].main;                // “Clear”, “Clouds”, …

        setData(res.data);
        setWeatherIcon(getWeatherIcon(condition));
        setBackgroundClass(getBgClass(condition));
        setErrorMessage("");

        // ✨ card entrance
        if (cardRef.current) {
          cardRef.current.classList.add("animate-in");
          
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setErrorMessage("Location not found. Please enter a valid city name.");
        } else {
          setErrorMessage("Something went wrong. Try again later.");
        }
      })
      .finally(() => setLoading(false));
  };

  /* ------------------------------- event handlers ------------------------------ */
  const searchLocation = (e) => e.key === "Enter" && fetchWeatherData();
  const toggleUnit = () =>
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  const handleCloseError = () => setErrorMessage("");

  /* ------------------------------- side effects -------------------------------- */
  // refetch when unit changes (if we already have data)
  useEffect(() => {
    if (location && Object.keys(data).length) fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // set date once on mount
  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  /* ------------------------------------ UI ------------------------------------- */
  return (
    <div className={`weather-app ${backgroundClass}`}>
      <div className="overlay" />

      <div className="app-container">
        {/* ---------- Search box + date ---------- */}
        <div className="search-container">
          <div className="search-box">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={searchLocation}
              placeholder="Search for a city..."
              type="text"
              className="search-input"
            />
            <button className="search-button" onClick={fetchWeatherData}>
              <i className="fas fa-search" />
            </button>
          </div>
          <div className="date-display">
            <p>{currentDate}</p>
          </div>
        </div>

        {/* ---------- Error banner ---------- */}
        {errorMessage && (
          <div className="error-message">
            <span className="error-text">{errorMessage}</span>
            <button className="close-button" onClick={handleCloseError}>
              &times;
            </button>
          </div>
        )}

        {/* ---------- Main card ---------- */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        ) : Object.keys(data).length ? (
          <div className="weather-card" ref={cardRef}>
            <div className="weather-header">
              <h2 className="location">
                {data.name}, {data.sys?.country}
                <span className="weather-icon">{weatherIcon}</span>
              </h2>

              <div className="temperature-display">
                <h1 className="temperature">
                  {Math.round(data.main.temp)}
                  <span className="unit">
                    {unit === "metric" ? "°C" : "°F"}
                  </span>
                </h1>
                <p className="weather-description">
                  {data.weather[0].description}
                </p>
              </div>
            </div>

            <div className="weather-details">
              <Detail
                icon="🌡️"
                value={`${Math.round(data.main.feels_like)}${
                  unit === "metric" ? "°C" : "°F"
                }`}
                label="Feels like"
              />
              <Detail icon="💧" value={`${data.main.humidity}%`} label="Humidity" />
              <Detail
                icon="🌬️"
                value={
                  unit === "metric"
                    ? `${Math.round(data.wind.speed * 3.6)} km/h`
                    : `${Math.round(data.wind.speed)} mph`
                }
                label="Wind"
              />
            </div>

            <button className="unit-toggle" onClick={toggleUnit}>
              Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
              <span className="toggle-icon">🔄</span>
            </button>
          </div>
        ) : (
          <div className="welcome-message">
            <h2>Weather Forecast</h2>
            <p>Enter a city name to get current weather information</p>
            <div className="weather-icons">
              <span>☀️</span>
              <span>🌧️</span>
              <span>⛅</span>
              <span>❄️</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- tiny component to keep JSX clean -------- */
const Detail = ({ icon, value, label }) => (
  <div className="detail-item">
    <div className="detail-icon">{icon}</div>
    <div className="detail-text">
      <span className="detail-value">{value}</span>
      <span className="detail-label">{label}</span>
    </div>
  </div>
);

export default App;
