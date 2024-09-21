import "./Weather.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import sunshine from "./img/sunshine.png";
import wind from "./img/wind.png";
import humidity from "./img/humidity.png";
import { useEffect, useRef, useState } from "react";


export default function Weather() {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": "https://openweathermap.org/img/wn/01d@2x.png",
        "01n": "https://openweathermap.org/img/wn/01n@2x.png",
        "02d": "https://openweathermap.org/img/wn/02d@2x.png",
        "02n": "https://openweathermap.org/img/wn/02n@2x.png",
        "03d": "https://openweathermap.org/img/wn/03d@2x.png",
        "03n": "https://openweathermap.org/img/wn/03n@2x.png",
        "04d": "https://openweathermap.org/img/wn/04d@2x.png",
        "04n": "https://openweathermap.org/img/wn/04n@2x.png",
        "09d": "https://openweathermap.org/img/wn/09d@2x.png",
        "09n": "https://openweathermap.org/img/wn/09n@2x.png",
        "10d": "https://openweathermap.org/img/wn/10d@2x.png",
        "10n": "https://openweathermap.org/img/wn/10n@2x.png",
        "11d": "https://openweathermap.org/img/wn/11d@2x.png",
        "11n": "https://openweathermap.org/img/wn/11n@2x.png",
        "13d": "https://openweathermap.org/img/wn/13d@2x.png",
        "13n": "https://openweathermap.org/img/wn/13n@2x.png",
        "50d": "https://openweathermap.org/img/wn/50d@2x.png",
        "50n": "https://openweathermap.org/img/wn/50n@2x.png"
    }

    const search = async (city)=>{
        if(city === ""){
            alert("Enter a City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if(!response.ok){
                alert(data.message);
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || sunshine
            setWeatherData({
                humidity: data.main.humidity,
                location: data.name,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                icon: icon
            })
        } catch (error) {
            setWeatherData(false);
            console.error("Broken API");
        }
    }

    useEffect(()=>{
        search("Togo");
    },[])

  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref={inputRef} type='text' placeholder='Search' />
            <p><FontAwesomeIcon icon={faMagnifyingGlass} onClick={()=>search(inputRef.current.value)} /></p>
        </div>
        {weatherData ? <>
            <div className="data">
                <div className='current-weather'>
                    <img src={weatherData.icon} alt='sunshine' className='weather-icon' />
                    <p className='temterature'>{weatherData.temperature}<sup>o</sup>c</p>
                    <p className='location'>{weatherData.location}</p>
                </div>
                <div className="weather-data">
                    <div className="row">
                        <img src={humidity} alt="humIcon"></img>
                        <div>
                            <p className="p">{weatherData.humidity} %</p>
                            <span>Humidity</span>
                        </div>
                    </div>
                    <div className="row">
                        <img src={wind} alt="humIcon"></img>
                        <div>
                            <p>{weatherData.windSpeed} km/h</p>
                            <span>Wind</span>
                        </div>
                    </div>
                </div>
            </div>
        </> : <></>}
    </div>
  )
}
