import React from 'react';
import './Weather.css';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

const Weather = () => {
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '39a0efe4b13f3c2c01d5ee665e14217e',
        lat: '38.9582',
        lon: '-122.6264',
        lang: 'en',
        unit: 'metric', // values are (metric, standard, imperial)
      });
    if (data) {
        const { forecast, current } = data;
        if (isLoading) {
            return <div>Loading...</div>;
        }
        if (errorMessage) {
            return <div>{errorMessage}</div>;
        }
        console.log(current);
        return (
            <div className='weather-container'>
                <h2>{current.temperature.current}&#176;C</h2>
                <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 -5 35 40"
                fill="#022851">
                    <title>{current.description}</title>
                    <path d={current.icon} />
                </svg>
            </div>
        );
    }
    return null;
};

export default Weather;