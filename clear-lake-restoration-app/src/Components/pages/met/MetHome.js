import React from 'react';
import Map from '../../Map.js'

/**
 * Component for showing the Meteorology Overview page.
 * @returns {JSX.Element}
 */
export default function MetHome() {
    return (
        <div>
            <div className='met-home data-home'>
                <h1 className='data-title'>Meteorological Stations</h1>
            </div>
            
            <div className='data-desc-container'>
                <p className='data-desc'>In March 2019, seven metrological stations were installed around the perimeter of Clear Lake. The stations record wind speed, wind direction, precipitation, air temperature, atmospheric pressure, solar radiation and relative humidity. A cellular modem wirelessly transmits the data every 15 minutes to the cloud where it is publicly accessible. </p>
            </div>
            <Map name="met"/>
        </div>
    )
}