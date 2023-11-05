/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY;

const Filter = ({ newFilter, handleFilterInput }) => {
  return (
    <div>
      find countries <input value={newFilter} onChange={handleFilterInput} />
    </div>
  );
};

const Country = ({ country }) => {
  const [weatherReport, setWeatherReport] = useState(null);

  const lat = country.capitalInfo.latlng[0];
  const lon = country.capitalInfo.latlng[1];

  let languages = [];
  Object.entries(country.languages).map((entry) => {
    languages.push(entry[1]);
  });

  const celcius = (kelvin) => kelvin - 273;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
      )
      .then((response) => {
        setWeatherReport(response.data.list[0]);
      });
  }, []);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
      <h3>Weather in {country.capital}</h3>
      {weatherReport ? (
        <div>
          <p>temperature {celcius(weatherReport.main.temp).toFixed(2)}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherReport.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>wind {weatherReport.wind.speed} m/s</p>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

const Countries = ({ country, setShowCountry }) => {
  return (
    <li>
      {country.name.common}{" "}
      <button onClick={() => setShowCountry(country)}>show</button>{" "}
    </li>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const handleFilterInput = (event) => {
    setNewFilter(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().startsWith(newFilter.toLowerCase())
  );

  const setShowCountry = (country) => {
    setNewFilter(country.name.common);
  };

  if (filteredCountries.length > 10) {
    return (
      <div>
        <Filter newFilter={newFilter} handleFilterInput={handleFilterInput} />
        <p>Too many matches, specify another filter</p>
      </div>
    );
  } else if (filteredCountries.length === 1) {
    return (
      <div>
        <Filter newFilter={newFilter} handleFilterInput={handleFilterInput} />
        <Country country={filteredCountries[0]} />
      </div>
    );
  }
  return (
    <div>
      <Filter newFilter={newFilter} handleFilterInput={handleFilterInput} />
      <ul>
        {filteredCountries.map((country) => (
          <Countries
            key={country.name.common}
            country={country}
            setShowCountry={setShowCountry}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
