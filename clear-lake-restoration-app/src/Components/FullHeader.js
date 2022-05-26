import React, { useState } from 'react';
import './FullHeader.css';
import Title from './Title.js';
import Weather from './Weather.js';
import WeatherWidget from './WeatherWidget.js';
import { useOpenWeather } from 'react-open-weather';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY

function FullHeader() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: API_KEY,
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