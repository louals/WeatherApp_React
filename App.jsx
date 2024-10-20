import React, { useState , useEffect} from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [unit, setUnit] = useState("metric"); 
  const [currentDate, setCurrentDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const apiKey = "8bfa885b3600bdee69135e962d6c84f8";

  
  const fetchWeatherData = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;
    if (location !== "") {
      axios.get(url)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
          setErrorMessage("");
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setErrorMessage("Location not found. Please enter a valid city name.");
          } else {
            setErrorMessage("Something went wrong. Please try again later.");
          }
        });
    } else {
      setErrorMessage("Please enter a location.");
    }
  };

  
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData();
    }
  };

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  // Re-fetch data when the unit changes
  useEffect(() => {
    if (location !== "") {
      fetchWeatherData();
    }
  }, [unit]); // Effect will run whenever `unit` changes

  useEffect(() => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);


  const handleCloseError = () => {
    setErrorMessage(""); // Clear the error message
  };
  return (
    <>
      
      
      <video autoPlay loop muted playsInline>
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div> {/* Transparent overlay */}
      <div className="app">
        <div className="search">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter Location"
            onKeyPress={searchLocation}
            type="text"
            className="srch"
          />
          <div className="date">
            <p>{currentDate}</p>
          </div>

        </div>


        {errorMessage && (
          <div className="error-message">
            <span className="error-text">{errorMessage}</span>
            <button className="close-button" onClick={handleCloseError}>
              &times; {/* Close button */}
            </button>
          </div>
        )}


        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? (
                <h1>
                  {Math.round(data.main.temp)}{" "}
                  <span>{unit === "metric" ? "°C" : "°F"}</span>
                </h1>
              ) : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].description}</p> : null}
            </div>
          </div>

          

          {/* Unit Toggle Button */}
          <div className="toggle">
          <button className="toggle-btn" onClick={toggleUnit}>
            Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
          </div>
       

          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">
                  {Math.round(data.main.feels_like)}{" "}
                  {unit === "metric" ? "°C" : "°F"}
                </p>
              ) : null}
              <p>Feels like</p>
            </div>

            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>

            <div className="wind">
              {data.wind ? (
                <p className="bold">
                  {unit === "metric"
                    ? `${Math.round(data.wind.speed * 3.6)} km/h`
                    : `${Math.round(data.wind.speed)} mph`}
                </p>
              ) : null}
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;