import React from 'react';

import Map from '../Map.js'

export default function Home() {
    return (
        <div>
            <h1 className='home'>Clear Lake Data</h1>
            <div className='mission-container'>
                <h3 className="info-header">TERC Clear Lake Mission</h3>
                <p className="info-text">UC Davis Tahoe Environmental Research Center (TERC) is engaged in a multi-year research study to 
                    understand the dominant processes in the Clear Lake watershed and within the lake itself that are 
                    negatively impacting the rehabilitation of lake water quality and ecosystem health. With funding 
                    provided by the California State Assembly, researchers are collecting a wide-variety of data to 
                    form the basis of a long-term monitoring strategy to measure status and trends in the future. 
                    A set of numerical models, calibrated and validated with these data, will be developed to inform 
                    local and State decision-making. Through partnerships and collaborations with local stakeholders 
                    and resource agencies, we aim to provide the science to guide better management of Clear Lake.</p>
            </div>
            <Map name="all"/>
        </div>
    )
}