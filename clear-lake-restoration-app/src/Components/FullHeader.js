import React, { useState } from 'react';
import './FullHeader.css';
import Title from './Title.js';
import Weather from './Weather.js';
import WeatherWidget from './WeatherWidget.js';
import { useOpenWeather } from 'react-open-weather';

/**
 * Component for showing the header that is above the navbar. Header includes logo, title, weather widget.
 * @returns {JSX.Element}
 */
function FullHeader() {
    // show the weather widget or not
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);

    /**
     * Use OpenWeatherMap API to get the weather.  
     * API key is from https://openweathermap.org/api  
     * documentation: https://www.npmjs.com/package/react-open-weather
     */
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '39a0efe4b13f3c2c01d5ee665e14217e',
        lat: '38.9582',
        lon: '-122.6264',
        lang: 'en',
        unit: 'imperial', // values are (metric, standard, imperial)
    });

    return (
        <>
        <div className="full-header">
            <Title/>
            <div className='weather-container' onClick={handleShow}>
                <Weather show={show} data={data} isLoading={isLoading} errorMessage={errorMessage} />
            </div>
        </div>
        {show ? <WeatherWidget data={data} isLoading={isLoading} errorMessage={errorMessage} /> : null}
        </>
    )
}

export default FullHeader;