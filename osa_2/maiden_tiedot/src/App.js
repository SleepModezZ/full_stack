import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
    find countries <input value={filter} onChange={handleFilter}/>
    </div>
  )
}

const DisplayName = ({ name, countries, setFilter}) => {
  function show() {
    setFilter(name)
  }
  return (
  <p>{name}<button type="button" onClick={show} >show</button></p>
  )
}

const DisplayLanguage = ({ language }) => <li>{language}</li>

const DisplayDetails = ({ country, weather, setWeather }) => {
  // Säätiedotusta varten:
  const api_key = process.env.REACT_APP_API_KEY
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]
  const call = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
  useEffect(() => {
    axios
      .get(call)
      .then(response => {
        setWeather(response.data)
        
      })
  }, [])
  console.log(weather)

  // Kieliä varten
  let languages = []
  for (const key of Object.keys(country.languages)) {
    languages.push(country.languages[key])
  }
  // palautettava jsx
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}<br/>
         area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map(l => 
          <DisplayLanguage key={l} language={l} />
        )}
      </ul>
      <img src={country.flags.png} alt="County flag" />
      <h2>Weather in {country.capital[0]}</h2>
      <p>temperature {weather.main.temp} Celcius</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather" />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const DisplayCountries = ({ countries, filter, setFilter, weather, setWeather }) => {
  const  filtered = countries.filter(c => c.name.common.toUpperCase().includes(filter.toUpperCase()))
  if (filtered.length !== 1) {
    const f = filtered.map(c => c.name.common)
    f.sort()
    return (
      <div>
        {f.map(c => 
          <DisplayName key={c} name={c} countries={countries} setFilter={setFilter}/>
        )}
      </div>
    )}
  else {
    return (
      <div>
        <DisplayDetails country={filtered[0]} weather={weather} setWeather={setWeather}/>
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [names, setNames] = useState([]) 
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState({}) 


  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  console.log(countries)

  // Kutsun säätiedotusta jo tässä vaiheessa, jotta saan weather-tilaan oikeanlaisen objektin.
  // Muuten törmään luultavasti asynkronisuuden aiheuttamiin ongelmiin DisplayDetails-funktiossa
  // (weather on undefined), jossa kutsun weathermap-apia oikean kaupungin tiedoilla.
  // Luultavasti olisi parempikin tapa toteuttaa tämä, mutta olen jo käyttänyt jo liikaa aikaa
  // tämän tehtävän tekemiseen.
  const api_key = process.env.REACT_APP_API_KEY
  const lat = 10.00
  const lon = 10.00
  const call = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
  useEffect(() => {
    axios
      .get(call)
      .then(response => {
        setWeather(response.data)
        console.log(weather)
      })
  }, [])
  
  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} handleFilter={handleFilter} />
      <DisplayCountries countries={countries} filter={filter} setFilter={setFilter} weather={weather} setWeather={setWeather}/>
    </div>
  )
}

export default App
