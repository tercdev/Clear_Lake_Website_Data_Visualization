import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';

function TChainData() {
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    function handleStartDateChange(e) {
        setStartDate(e);
    }
    function handleEndDateChange(e) {
        setEndDate(e);
    }
    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
        setId(idTemp);
    }
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);

    

    var url = new URL('https://3kgpak926a.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata')
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('start',convertDate(startGraphDate));
    search_params.set('end',convertDate(endGraphDate));
    url.search = search_params.toString();
    
    const profileData = useFetch(url.toString());

    const [profilecsv, setprofilecsv] = useState([])

    useEffect(()=> {
        if (!profileData.isLoading){
            setprofilecsv(profileData.data);                  
        }
    },[profileData.isLoading])
    
    function convertDate(date) {
        let year = date.getFullYear().toString();
        let month = (date.getMonth()+1).toString();
        let day = date.getDate().toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return year+month+day;
    }
    return (
        <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select onChange={(e) => setIdTemp(e.target.value)}>
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
            />
            </div>
            <button className="submitButton" onClick={setGraphDates}>Submit</button>
        
        {profileData.isLoading && <center>Fetching Data...</center>}
        {!profileData.isLoading && profileData.data.length != 0 && <CSVLink data={profilecsv} className="csv-link" target="_blank">Download Profile Data</CSVLink>}
        {!profileData.isLoading && profileData.data.length == 0 && <p>There is no profile data.</p>}
        </center>
    </>
    )
}

export default TChainData;