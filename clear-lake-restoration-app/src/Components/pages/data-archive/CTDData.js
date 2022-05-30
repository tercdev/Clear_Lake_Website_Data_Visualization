import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import SpecificDateSelect from '../../SpecificDateSelect';
import { convertDatetoUTC } from '../../utils';

function CTDData() {
    const [showButton, setShowButton] = useState(false);
    var today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(today);
    const [endGraphDate, setGraphEndDate] = useState(today);
    function handleStartDateChange(e) {
        setStartDate(e);
        setShowButton(false)
    }
    function setGraphDates() {
        console.log(startDate);
        setGraphStartDate(startDate);
        setGraphEndDate(startDate);
        setId(idTemp);
    }
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);

    var url = new URL('https://3kgpak926a.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata')
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('start',convertDatetoUTC(startGraphDate));
    search_params.set('end',convertDatetoUTC(endGraphDate));
    url.search = search_params.toString();
    
    const profileData = useFetch(url.toString());

    const [profilecsv, setprofilecsv] = useState([])

    useEffect(()=> {
        if (!profileData.isLoading){
            setprofilecsv(profileData.data);   
            setShowButton(true)               
        }
    },[profileData.isLoading])
    var dates_url = new URL('https://v35v56rdp6.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata-sitedates');
    var dates_search_params = dates_url.searchParams;
    dates_search_params.set('id', id);
    dates_url.search = dates_search_params.toString();
    const includedDates = useFetch(dates_url.toString());
    return (
        <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select className="select-drop" onChange={(e) => {setIdTemp(e.target.value); setShowButton(false)}}>
                    <option value="1">UA-01</option>
                    <option value="2">UA-06</option>
                    <option value="3">UA-07</option>
                    <option value="4">UA-08</option>
                    <option value="5">LA-03</option>
                    <option value="6">NR-02</option>
                    <option value="7">OA-04</option>
                </select>
            </div>
            <div className='date-container1'>
                <SpecificDateSelect 
                    data={includedDates.data} 
                    isLoading={includedDates.isLoading} 
                    onSelect={handleStartDateChange}
                />
                <button className="submitButton" onClick={setGraphDates}>Submit</button>
            </div>
        {profileData.isLoading && <center>Fetching Data...</center>}
        {!profileData.isLoading && profileData.data.length != 0 && showButton && <CSVLink data={profilecsv} className="csv-link" target="_blank">Download Profile Data</CSVLink>}
        {!profileData.isLoading && profileData.data.length != 0 && showButton && <a href={require("../../../Metadata/README_ctd.txt")} download="README_ctd">Download Profile Data Metadata README</a>}
        </center>
    </>
    )
}

export default CTDData;