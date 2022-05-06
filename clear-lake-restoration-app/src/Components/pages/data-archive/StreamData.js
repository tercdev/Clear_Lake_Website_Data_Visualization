import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate, addDays, subDays } from '../../utils';
import StreamCleanData from './StreamCleanData';
import StreamRealData from './StreamRealData';
import ErrorBoundary from '../../ErrorBoundary';

import './DataArchive.css';

function StreamData() { 
    
    const [toggle, setToggle] = useState(false);
    function toggleTrue() {
        setToggle(true);
    }
    function toggleFalse() {
        setToggle(false);
    }
    return (
    <div className='center-container'>
        <div className='button-container'>
        <button className={toggle ? "clean-real-button clicked" : "clean-real-button"} onClick={toggleTrue}>Clean Data</button>
        <button className={toggle ? "clean-real-button" : "clean-real-button clicked"} onClick={toggleFalse}>Real Time</button>
        </div>
        {toggle ? <ErrorBoundary><StreamCleanData/></ErrorBoundary> : <StreamRealData/>}
    </div>
    )
}

export default StreamData;