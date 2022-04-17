import React from 'react';
import './WeatherWidget.css';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

const WeatherWidget = () => {
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '39a0efe4b13f3c2c01d5ee665e14217e',
        lat: '38.9582',
        lon: '-122.6264',
        lang: 'en',
        unit: 'metric', // values are (metric, standard, imperial)
      });
    // console.log(data.current.temperature.current);
    // console.log(data.current.description);
    // console.log(data.current.icon);
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
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          locationLabel="Clear Lake"
          unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
          showForecast
        />
      );
};

export default WeatherWidget;