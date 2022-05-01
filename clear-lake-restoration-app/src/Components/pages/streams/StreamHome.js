import React from 'react';
import Map from '../../Map.js'
import imge from './Middle\ creek\ monitoring\ site.jpeg'

export default function StreamHome() {
    return (
        <div>
            <div className='stream-home'>
                <h1 className='stream-title'>Stream Monitoring</h1>
            </div>
            {/* <div>
                <p>Middle Creek monitoring site</p>
                </div> */}
            
            <div className='stream-desc-container'>
                <p className='stream-desc'>In December 2018, in-situ stream sensors were deployed in the three primary lake tributaries: Kelsey, Middle and Scotts Creek. The probes record stream turbidity and temperature measurements and transmit data every 10 minutes via a cellular modem to UC Davis servers. The sensors are co-located with existing California Department of Water Resources gauging stations. </p>
            </div>


            
            <Map name="stream"/>
            
        </div>
    )
}