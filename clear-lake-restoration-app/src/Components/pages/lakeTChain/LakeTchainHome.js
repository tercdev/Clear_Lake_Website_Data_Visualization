import React from 'react';

import Map from '../../Map.js'

/**
 * Component for showing the Lake Mooring Overview page.
 * @returns {JSX.Element}
 */
export default function LakeTchainHome() {
    return (
        <div>
            <div className='lake-tchain-home data-home'>
                <h1 className='data-title'>Lake Moorings</h1>
            </div>
            
            <div className='data-desc-container'>
                <p className='data-desc'>In March 2019, sub-surface moorings were deployed in 7 locations throughout Upper, Oaks and Lower Arms of Clear Lakes. These moorings contain an array sensors which record vertical temperature and dissolved oxygen profiles at 30 second and 10-minute sampling intervals respectively. Moorings are recovered every 3 months in order to download data and service the probes. The map below shows the approximate locations of these moorings. </p>
            </div>
            <Map name="lake"/>
        </div>
    )
}