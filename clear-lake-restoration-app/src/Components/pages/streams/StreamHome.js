import React from 'react';
import Map from '../../Map.js'

export default function StreamHome() {
    return (
        <div>
            <div className='stream-home data-home'>
                <h1 className='data-title'>Stream Monitoring</h1>
            </div>
            
            <div className='data-desc-container'>
                <p className='data-desc'>In December 2018, in-site stream sensors were deployed in the three primary lake tributaries: Kelsey, Middle and Scotts Creek. The probes record stream turbidity and temperature measurements and transmit data every 10 minutes via a cellular modem to UC Davis servers. The sensors are co-located with existing California Department of Water Resources gauging stations. </p>
            </div>

            <Map name="stream"/>
        </div>
    )
}