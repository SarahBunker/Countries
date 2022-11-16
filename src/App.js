import { useState, useEffect } from 'react';
import axios from 'axios';

function CountryInfo({}) {

}

function CountryName({name}) {
  return (<div>{name}</div>)
}

function Countries({filteredCountries}) {
  let len = filteredCountries.length
  if (len <= 0) {
    return (<div></div>)
  }
  if (len > 10) {
    return (<div>Too many matches, specify another filter</div>)
  }
  if (len === 1) {
    return (<div>Hello World</div>);
  }
  return (
    <div>
    {
      filteredCountries.map(country => {
        let name = country.name.official;
        return <CountryName name={name} key={name}/>
      })
    }
    </div>
  )
}

function App() {
  const [newFilter, setNewFilter] = useState('');
  const [countriesList, setCountriesList] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  // let countriesList = [];

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
    getFilteredCountries(event);
  }

  const getCountries = () => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => setCountriesList(response.data));
  }

  function getFilteredCountries(event) {
    let filteredCountriesByName = countriesList.filter( country => {
      let lowerCaseName = country.name.official.toLowerCase();
      let lowerCaseFilter = newFilter.toLowerCase();
      return lowerCaseName.includes(lowerCaseFilter);
    })
    setFilteredCountries(filteredCountriesByName);
  }

  useEffect(getCountries, []);

  return (
    <div>
      <div>Find Countries
        <input value={newFilter} onChange={handleFilterChange}/>
      </div>
      <Countries filteredCountries={filteredCountries}/>
      <div>debug: {countriesList.length} </div>
      <div>debug: {filteredCountries.length} </div>
    </div>
  );
}

export default App;
