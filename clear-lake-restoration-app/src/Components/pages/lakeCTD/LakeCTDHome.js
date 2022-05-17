import React from 'react';

import Map from '../../Map.js'

export default function LakeCTDHome() {
    return (
        <div>
            <div className='lake-CTD-home data-home'>
                <h1 className='data-title'>Lake CTD Profiling</h1>
            </div>
            
            <div className='data-desc-container'>
                <p className='data-desc'>During water quality sampling and mooring recovery events a SBE 19plus V2 SeaCAT Profiler CTD is deployed at each site to collect a high resolution vertical profile of water temperature, dissolved oxygen, chlorophyll, turbidity, salinity, light attenuation and conductivity.</p>
            </div>
            <Map name="profile"/>
        </div>
    )
}