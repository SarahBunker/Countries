import { useState, useEffect } from 'react';
import axios from 'axios';

const Button = ({clickFunction, text}) => {
  return <button onClick={clickFunction}>{text}</button>
}

function ShowButton({name, filterFunc}) {
  const clickFunction = () => {
    filterFunc(name)
  };
  const text = "show";
  return <Button clickFunction={clickFunction} text={text} />
}

function CountryInfo({country}) {
  let name = country.name.official;
  let languages = Object.values(country.languages)
  let flagPNG = country.flags.png
  console.log("languages", languages);
  return (
  <div>
    <h1>{name}</h1>
    <div>
      <p>capital {country.capital[0]} </p>
      <p>area {country.area} </p>
    </div>
    <div>
      <h3>languages:</h3>
      <ul>
        {languages.map( lang => <li key={lang}>{lang}</li>)}
      </ul>
    </div>
    <img src={flagPNG} alt={`${name}'s flag`} />
  </div>
  )
}

function CountryInfoShort({name, filterFunc}) {
  return (
  <div>
    {name}
    <ShowButton name={name} filterFunc={filterFunc}/>
  </div>)
}

function FilteredCountriesComp({filteredCountries, filterFunc}) {
  return filteredCountries.map(country => {
    let name = country.name.official;
    return <CountryInfoShort name={name} key={name} filterFunc={filterFunc}/>
  })
}

function Countries({filteredCountries, filterFunc}) {
  let len = filteredCountries.length
  if (len <= 0) {
    return (<div></div>)
  }
  if (len > 10) {
    return (<div>Too many matches, specify another filter</div>)
  }
  if (len === 1) {
    return <CountryInfo country={filteredCountries[0]}/>;
  }
  return (
    <FilteredCountriesComp filteredCountries={filteredCountries} filterFunc={filterFunc}/>
  )
}

function App() {
  const [newFilter, setNewFilter] = useState('');
  const [countriesList, setCountriesList] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

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
      <Countries filteredCountries={filteredCountries} filterFunc={setNewFilter}/>
      <div>debug: {countriesList.length} </div>
      <div>debug: {filteredCountries.length} </div>
    </div>
  );
}

export default App;
