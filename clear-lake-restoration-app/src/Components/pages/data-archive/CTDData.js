import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';

function CTDData() {
    const [showButton, setShowButton] = useState(false);
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    function handleStartDateChange(e) {
        setStartDate(e);
        setShowButton(false)
    }
    function setGraphDates() {
        console.log(startDate);
        setGraphStartDate(startDate);
        let x = new Date(startDate.getFullYear(), startDate.getMonth(), 28);
        console.log(x);
        setGraphEndDate(x);
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
            setShowButton(true)               
        }
    },[profileData.isLoading])
    
    return (
        <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select onChange={(e) => {setIdTemp(e.target.value); setShowButton(false)}}>
                    <option value="1">UA-01</option>
                    <option value="2">UA-06</option>
                    <option value="3">UA-07</option>
                    <option value="4">UA-08</option>
                    <option value="5">LA-03</option>
                    <option value="6">NR-02</option>
                    <option value="7">OA-04</option>
                    <option value="8">LA03_SB19</option>
                    <option value="9">LA03_SB25</option>
                    <option value="10">UA01_SB25</option>
                    <option value="11">NR02_SB19</option>
                    <option value="12">NR02_SB25</option>
                    <option value="13">OA04_SB19</option>
                    <option value="14">OA04_SB25</option>
                    <option value="15">UA06_SB19</option>
                    <option value="16">UA06_SB25</option>
                    <option value="17">UA07_SB19</option>
                    <option value="18">UA07_SB25</option>
                    <option value="19">UA08_SB19</option>
                    <option value="20">UA08_SB25</option>
                    <option value="21">UA08_UA07</option>
                    <option value="22">UA01_SB19</option>
                </select>
            </div>
            <div className='one-date-container'>
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                minDate={new Date("2019/01/01")}
                maxDate={today}
                showMonthYearPicker
                dateFormat="MM/yyyy"
            />
            </div>
            <button className="submitButton" onClick={setGraphDates}>Submit</button>
        
        {profileData.isLoading && <center>Fetching Data...</center>}
        {!profileData.isLoading && profileData.data.length != 0 && showButton && <CSVLink data={profilecsv} className="csv-link" target="_blank">Download Profile Data</CSVLink>}
        {!profileData.isLoading && profileData.data.length != 0 && showButton && <a href={require("../../../Metadata/README_ctd.txt")} download="README_ctd">Download Profile Data Metadata README</a>}
        {!profileData.isLoading && profileData.data.length == 0 && <p>There is no profile data for {startGraphDate.getMonth()+1} / {startGraphDate.getFullYear()}.</p>}
        </center>
    </>
    )
}

export default CTDData;