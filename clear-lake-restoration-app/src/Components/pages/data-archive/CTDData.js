import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';
import SpecificDateSelect from '../../SpecificDateSelect';

function CTDData() {
    const [showButton, setShowButton] = useState(false);
    var today = new Date();
    // var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
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
        // let x = new Date(startDate.getFullYear(), startDate.getMonth(), 28);
        // console.log(x);
        // setGraphEndDate(x);
        setGraphEndDate(startDate);
        setId(idTemp);
    }
    function convertDatetoUTC(date) {
        let year = date.getUTCFullYear().toString();
        let month = (date.getUTCMonth()+1).toString();
        let day = date.getUTCDate().toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return year+month+day;
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
    const [dates, setDates] = useState([]);
    useEffect(() => {
        if (!includedDates.isLoading) {
            let m = [];
            includedDates.data.forEach((element => {
                m.push(new Date(element["DateTime_UTC"]));
            }))
            setDates(m);
            console.log(m)
            console.log(includedDates.data)
        }
    },[includedDates.isLoading])
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
            {/* <div className='one-date-container'>
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                minDate={new Date("2019/01/01")}
                maxDate={today}
                showMonthYearPicker
                dateFormat="MM/yyyy"
            />
            </div> */}
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
        {/* {!profileData.isLoading && profileData.data.length == 0 && <p>There is no profile data for {startGraphDate.getMonth()+1} / {startGraphDate.getFullYear()}.</p>} */}
        </center>
    </>
    )
}

export default CTDData;