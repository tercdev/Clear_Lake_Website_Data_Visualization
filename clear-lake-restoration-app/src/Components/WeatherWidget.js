import React from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import './WeatherWidget.css';

const WeatherWidget = (props) => {
    // const { data, isLoading, errorMessage } = useOpenWeather({
    //     key: '39a0efe4b13f3c2c01d5ee665e14217e',
    //     lat: '38.9582',
    //     lon: '-122.6264',
    //     lang: 'en',
    //     unit: 'imperial', // values are (metric, standard, imperial)
    //   });
    // console.log(data)
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