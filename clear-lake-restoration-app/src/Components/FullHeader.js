import React, { useState } from 'react';
import './FullHeader.css';
import Title from './Title.js';
import Weather from './Weather.js';
import WeatherWidget from './WeatherWidget.js';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

function FullHeader() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);
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