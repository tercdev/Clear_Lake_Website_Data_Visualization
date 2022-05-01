import React, { useState } from 'react';
import Highcharts from 'highcharts';

export default function LakeTchain(props) {

    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <div className='data-disclaimer'>
                <p className='disclaimer1'>Note: These data are provisional and not error checked!</p>
                <p className='disclaimer2'>These data were collected and are currently being processed and analyzed by 
                    the UC Davis Tahoe Environmental Research Center (TERC). They are 
                    considered preliminary. Do not use or distribute without written permission 
                    from TERC.</p>
            </div>
        </div>
        
    )
}