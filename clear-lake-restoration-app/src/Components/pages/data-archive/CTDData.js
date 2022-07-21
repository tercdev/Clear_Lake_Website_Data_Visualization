import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import SpecificDateSelect from '../../SpecificDateSelect';
import { convertDatetoUTC } from '../../utils';

/**
 * Component showing the CTD data download.
 * @returns {JSX.Element}
 */
function CTDData() {
    // for the download button
    const [showButton, setShowButton] = useState(false);
    // set all initial dates to today
    var today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(today);
    const [endGraphDate, setGraphEndDate] = useState(today);
    /**
     * Set the start date and hide the button.
     * @param {Date} e 
     */
    function handleStartDateChange(e) {
        if (typeof e !== Date) {
            setStartDate(e);
            setShowButton(false);
        }
    }
    /**
     * Set the graph start and end dates and id which are the query parameters for the API call.
     */
    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(startDate);
        setId(idTemp);
    }
    // initial id = 1
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);
    // for name of csv file
    const [siteName, setSiteName] = useState("");
    /**
     * API endpoint for clean profile data
     */
    var url = new URL('https://5fw1h3peqb.execute-api.us-west-2.amazonaws.com/v1/clearlake-profiledata');
    /**
     * query parameters: 
     * - `id`: of the site
     * - `start`: date string YYYYMMDD
     * - `end`: date string YYYYMMDD
     */
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('start',convertDatetoUTC(startGraphDate));
    search_params.set('end',convertDatetoUTC(endGraphDate));
    url.search = search_params.toString();
    /**
     * `profileData.isLoading` tells whether data is still being fetched or not    
     * `profileData.data` contains the data  
     * `profileData.error` contains any error message
     */
    const profileData = useFetch(url.toString());
    // data that will be in the downloadable csv
    const [profilecsv, setprofilecsv] = useState([]);

    useEffect(()=> {
        if (!profileData.isLoading){ // data is ready
            setprofilecsv(profileData.data);   
            setShowButton(true);
            if (profileData.data.length > 0) {
                setSiteName(profileData.data[0].Site);
            }
                       
        }
    },[profileData.isLoading])

    /**
     * API endpoint for the distinct dates where the site has profile data
     */
    var dates_url = new URL('https://5fw1h3peqb.execute-api.us-west-2.amazonaws.com/v1/clearlake-profiledata-sitedates');
    /**
     * query parameters:
     * - `id`: of the site
     */
    var dates_search_params = dates_url.searchParams;
    dates_search_params.set('id', idTemp);
    dates_url.search = dates_search_params.toString();
    /**
     * `includedDates.isLoading` tells whether data is still being fetched or not  
     * `includedDates.data` contains the data  
     * `includedDates.error` contains the error message
     */
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
        {!profileData.isLoading && profileData.data.length != 0 && showButton && <CSVLink filename={siteName + "_" + startGraphDate.toISOString().slice(0,10) + ".csv"} data={profilecsv} className="csv-link" target="_blank">Download Profile Data</CSVLink>}
        {!profileData.isLoading && profileData.data.length != 0 && showButton && <a href={require("../../../Metadata/README_ctd.txt")} download="README_ctd.txt">Download Profile Data Metadata README</a>}
        </center>
    </>
    )
}

export default CTDData;