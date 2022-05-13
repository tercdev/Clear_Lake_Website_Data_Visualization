import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';

function TChainData() {
    const [error, setError] = useState(false);
    const [showButton, setShowButton] = useState(false);
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    function handleStartDateChange(e) {
        setStartDate(e);
        setShowButton(false)
    }
    function handleEndDateChange(e) {
        setEndDate(e);
        setShowButton(false)
    }
    function setGraphDates() {
        setError(false);
        let latestDate = new Date(new Date(startDate).setDate(365));
        setGraphStartDate(startDate);
        if (endDate > latestDate) {
            setError(true);
            setEndDate(latestDate);
            setGraphEndDate(latestDate);
        } else {
            setGraphEndDate(endDate);
        }
        setId(idTemp);
    }
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);

    

    var temp_url = new URL('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature')
    var search_params_temp = temp_url.searchParams;
    search_params_temp.set('id',id);
    search_params_temp.set('start',convertDate(startGraphDate));
    search_params_temp.set('end',convertDate(endGraphDate));
    temp_url.search = search_params_temp.toString();
    
    const tempData = useFetch(temp_url.toString());

    var oxy_url = new URL('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen');
    var search_params_oxy = oxy_url.searchParams;
    search_params_oxy.set('id',id);
    search_params_oxy.set('start',convertDate(startGraphDate));
    search_params_oxy.set('end',convertDate(endGraphDate));
    oxy_url.search = search_params_oxy.toString();

    const oxyData = useFetch(oxy_url.toString());

    const [oxycsv, setoxycsv] = useState([])
    const [tempcsv, settempcsv] = useState([])
    useEffect(()=> {
        if (!oxyData.isLoading && !tempData.isLoading) { 
            settempcsv(tempData.data);                  
            setoxycsv(oxyData.data); 
            setShowButton(true)
        }
    },[oxyData.isLoading,tempData.isLoading])
    
    return (
        <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select onChange={(e) => {setIdTemp(e.target.value); setShowButton(false)}}>
                    <option value="1">LA-03</option>
                    <option value="2">NR-02</option>
                    <option value="3">OA-04</option>
                    <option value="4">OA-01</option>
                    <option value="5">UA-06</option>
                    <option value="6">UA-08</option>
                </select>
            </div>
            <div className='one-date-container'>
            <p className='date-label'>Start Date</p>
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                minDate={new Date("2019/1/1")}
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
            />
            </div>
            <div className='one-date-container'>
            <p className='date-label'>End Date</p>
            <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={today}
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
            />
            </div>
            <button className="submitButton" onClick={setGraphDates}>Submit</button>
            {error && <p className='error-message'>Selected date range was more than 365 days. End date was automatically changed.</p>}
        {oxyData.isLoading && <center>Fetching Data...</center>}
        {tempData.isLoading && <center>Fetching Data...</center>}
        {!oxyData.isLoading && oxyData.data.length != 0 && showButton && <CSVLink data={oxycsv} className="csv-link" target="_blank">Download Lake Oxygen Data</CSVLink>}
        {!oxyData.isLoading && oxyData.data.length == 0 && <p>There is no lake oxygen data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        {!tempData.isLoading && tempData.data.length != 0 && showButton && <CSVLink data={tempcsv} className="csv-link" target="_blank">Download Lake Temperature Data</CSVLink>}
        {!tempData.isLoading && tempData.data.length == 0 && <p>There is no lake temperature data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        {((!oxyData.isLoading && oxyData.data.length) || (!tempData.isLoading && tempData.data.length != 0)) && showButton && <a href={require("../../../Metadata/README_tchain.txt")} download="README_Tchain">Download Tchain Metadata README</a>}

        </center>
    </>
    )
}

export default TChainData;