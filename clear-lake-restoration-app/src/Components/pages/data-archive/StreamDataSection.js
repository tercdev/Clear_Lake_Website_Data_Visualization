import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import StreamData from './StreamData';

import './DataArchive.css';

function StreamDataSection() { 
    
    const [toggle, setToggle] = useState(false);
    function toggleTrue() {
        setToggle(true);
    }
    function toggleFalse() {
        setToggle(false);
    }
    return (
    <div className='center-container'>
        <p>Real time data is limited to 180 days.</p>
        <div className='button-container'>
        <button className={toggle ? "clean-real-button clicked" : "clean-real-button"} onClick={toggleTrue}>Clean Data</button>
        <button className={toggle ? "clean-real-button" : "clean-real-button clicked"} onClick={toggleFalse}>Real Time</button>
        </div>
        {toggle ? 
            <ErrorBoundary>
                <StreamData id="Clean" 
                    url="https://1j27qzg916.execute-api.us-west-2.amazonaws.com/default/clearlake-streamturb-api" 
                    variables={["Station_ID","DateTime_UTC","Turb","Temp"]}
                />
            </ErrorBoundary> : 
            <StreamData id="Real Time" 
                url="https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks"
                variables={["Creek","TmStamp","RecNum","Turb_BES","Turb_Mean","Turb_Median","Turb_Var","Turb_Min","Turb_Max","Turb_Temp"]}
            />}
    </div>
    )
}

export default StreamDataSection;