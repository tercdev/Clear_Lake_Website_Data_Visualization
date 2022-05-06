import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';
import ErrorBoundary from '../../ErrorBoundary';
import MeterologyCleanData from './MeterologyCleanData';
import MeterologyRealData from './MeterologyRealData'

import './DataArchive.css';

function MeterologyData() { 
    
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
        {toggle ? <ErrorBoundary><MeterologyCleanData/></ErrorBoundary> : <MeterologyRealData/>}
    </div>
    )
}

export default MeterologyData;