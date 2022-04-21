import React from 'react';
import './Weather.css';

const Weather = (props) => {
    if (props.data) {
        const { forecast, current } = props.data;
        if (props.isLoading) {
            return <div>Loading...</div>;
        }
        if (props.errorMessage) {
            return <div>{props.errorMessage}</div>;
        }
        let icon_name = "";
        {props.show ? icon_name = "fa-solid fa-angle-up" : icon_name = "fa-solid fa-angle-down"}
        return (
            <div className="inner-container">
                <h2>{current.temperature.current}&#176;F</h2>
                <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 -5 35 40"
                fill='#022851'>
                    <title>{current.description}</title>
                    <path d={current.icon} />
                </svg>
                <i className={icon_name}></i>
            </div>
        );
    }
    return null;
};

export default Weather;