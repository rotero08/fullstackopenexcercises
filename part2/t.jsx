/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ newFilter, handleFilterInput }) => {
  return (
    <div>
      find countries <input value={newFilter} onChange={handleFilterInput} />
    </div>
  );
};

const Country = ({ country }) => {
  let languages = [];
  Object.entries(country.languages).map((entry) => {
    languages.push(entry[1]);
  });
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
    </div>
  );
};

const Countries = ({ country, setShowCountry }) => {
  return (
    <li>
      {country.name.common}{" "}
      <button onClick={setShowCountry(country)}>show</button>{" "}
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

  let filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().startsWith(newFilter.toLowerCase())
  );

  const setShowCountry = (country) => {
    filteredCountries = countries.filter((countryItem) =>
      countryItem.name.common.toLowerCase().startsWith(country.toLowerCase())
    );
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
            setShowCountry={setShowCountry}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
