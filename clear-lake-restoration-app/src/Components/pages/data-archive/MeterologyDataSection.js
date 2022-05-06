import React, { useState, useEffect } from 'react';
import MeterologyData from './MeterologyData'

import './DataArchive.css';
import ErrorBoundary from '../../ErrorBoundary';

function MeterologyDataSection() { 
    
    const [toggle, setToggle] = useState(false);
    function toggleTrue() {
        setToggle(true);
    }
    function toggleFalse() {
        setToggle(false);
    }
    return (
    <div className='center-container'>
        <p>Real time data is limited to 150 days.</p>
        <div className='button-container'>
        <button className={toggle ? "clean-real-button clicked" : "clean-real-button"} onClick={toggleTrue}>Clean Data</button>
        <button className={toggle ? "clean-real-button" : "clean-real-button clicked"} onClick={toggleFalse}>Real Time</button>
        </div>
        {toggle ? <ErrorBoundary>
                <MeterologyData id="Clean" url="https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met"/>
            </ErrorBoundary> : 
        <MeterologyData id="Real Time" url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink"/>}
    </div>
    )
}

export default MeterologyDataSection;