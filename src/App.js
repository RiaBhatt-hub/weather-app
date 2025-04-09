import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const url =  `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=cc9ffe07ea24dffd57e292f6f1089384` 

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setLoading(true);
      setError('');
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
        setHistory((prev) => {
          const updated = [response.data.name, ...prev];
          return updated.slice(0, 5); 
        });



      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        if (error.response && error.response.status === 404) {
          setError('City not found. Please check the spelling.');
        } else {
          setError('Failed to fetch weather data. Please try again later.');
        }
      })
      .finally(() => {
        setLoading(false); 
        setLocation('');
      });
  }
};

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder='Enter Location'
          type='text'
        />
      </div>

      {history.length > 0 && (
        <div className="history">
          <h3>Recent Searches:</h3>
          <ul>
            {history.map((city, index) => (
              <li key={index}>{city}</li>
            ))}
          </ul>
        </div>
      )}
      
      {loading ? (
        <div className="loading">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      ) : (


      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="icon">
  {data.weather && data.weather.length > 0 && data.weather[0].icon ? (
    <img
      src= {`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
      alt="Weather Icon"
      className="w-20 h-20 mx-auto"
    />
  ) : null}
</div>

          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {/* Only show the bottom section if data.name exists */}
        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

export default App;