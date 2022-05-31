import React from 'react';
import ReactWeather from 'react-open-weather';
import './Weather.css';

/**
 * Component for showing a large weather widget including current weather conditions and a 4 day forecast.  
 * https://www.npmjs.com/package/react-open-weather
 * @param {boolean} isLoading 
 * @param {String} errorMessage 
 * @param {*} data
 * @returns {JSX.Element}
 */
const WeatherWidget = (props) => {
    const customStyles = {
        fontFamily:  'Helvetica, sans-serif',
        gradientStart:  '#022851',
        gradientMid:  '#6884A3',
        gradientEnd:  '#CDD6E0',
        locationFontColor:  '#FFF',
        todayTempFontColor:  '#FFF',
        todayDateFontColor:  '#B5DEF4',
        todayRangeFontColor:  '#B5DEF4',
        todayDescFontColor:  '#B5DEF4',
        todayInfoFontColor:  '#B5DEF4',
        todayIconColor:  '#FFF',
        forecastBackgroundColor:  '#FFF',
        forecastSeparatorColor:  '#DDD',
        forecastDateColor:  '#777',
        forecastDescColor:  '#777',
        forecastRangeColor:  '#777',
        forecastIconColor:  '#022851',
    };
    return (
        <ReactWeather
            theme={customStyles}
            isLoading={props.isLoading}
            errorMessage={props.errorMessage}
            data={props.data}
            lang="en"
            locationLabel="Clear Lake"
            unitsLabels={{ temperature: "°F", windSpeed: 'miles/h' }}
            showForecast
        />
    );
};

export default WeatherWidget;