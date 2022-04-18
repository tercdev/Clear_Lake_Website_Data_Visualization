import React from 'react';

import Map from '../../Map.js'

export default function MetHome() {
    return (
        <div>
            <h1 className='stream'>Meteorology Stations</h1>
            <Map name="met"/>
        </div>
    )
}