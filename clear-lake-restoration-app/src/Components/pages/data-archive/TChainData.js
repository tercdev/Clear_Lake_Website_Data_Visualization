import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'use-http';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';

/**
 * Component showing the TChain data download.
 * @returns {JSX.Element}
 */
function TChainData() {
    // for the download button
    const [showButton, setShowButton] = useState(false);
    // set start date as a week ago and end date as today
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    // data from API call
    const [oxygenDataArr,setOxygenDataArr] = useState([]);
    const [tempDataArr,setTempDataArr] = useState([]);
    // if the data is still being fetched or not
    const [isLoading,setIsLoading] = useState(true);
    // name in the csv
    const [siteNameTemp, setSiteNameTemp] = useState("");
    const [siteNameOxy, setSiteNameOxy] = useState("");
    /**
     * set start date and hide button
     * @param {Date} e 
     */
    function handleStartDateChange(e) {
        setStartDate(e);
        setShowButton(false);
    }
    /**
     * set end date and hide button
     * @param {Date} e 
     */
    function handleEndDateChange(e) {
        setEndDate(e);
        setShowButton(false);
    }
    /**
     * set the graph start and end dates and id which are the query parameters for the API call.
     */
    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
        setId(idTemp);
    }
    // initial id = 1
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);

    const lakeOxygen = useFetch('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen');

    const lakeTemp = useFetch('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature');

    // data in the csv
    const [oxycsv, setoxycsv] = useState([]);
    const [tempcsv, settempcsv] = useState([]);

    useEffect(() => {
        setOxygenDataArr([]);
        setTempDataArr([]);

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime();
        let diffDay = diffTime/(1000*3600*24);

        let oxygenFetch = [];
        let tempFetch = [];
        
        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 366) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 366));

            diffTime = endGraphDate.getTime() - newDay.getTime();
            diffDay = diffTime/(1000*3600*24);

            oxygenFetch.push(lakeOxygen.get(`?id=${id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));
            tempFetch.push(lakeTemp.get(`?id=${id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 366));
            compareDate = newDayPlusOne;

        }

        oxygenFetch.push(lakeOxygen.get(`?id=${id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`));
        tempFetch.push(lakeTemp.get(`?id=${id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`));
        setIsLoading(true); // Loading is true

        async function fetchData() {
            oxygenFetch = await Promise.all(oxygenFetch);
            tempFetch = await Promise.all(tempFetch);

            let combinedOxygenData = [].concat.apply([],oxygenFetch);
            let combinedTempData = [].concat.apply([],tempFetch);

            setOxygenDataArr(combinedOxygenData);
            setTempDataArr(combinedTempData);
            setIsLoading(false);
        }

        fetchData();

    },[startGraphDate,endGraphDate,id])

    useEffect(()=> {
        if (!isLoading) { 
            // add info to csv files
            settempcsv(tempDataArr);                  
            setoxycsv(oxygenDataArr);
            if (oxygenDataArr.length !== 0 && tempDataArr.length !== 0) {
                setSiteNameOxy(oxygenDataArr[0].Site);
                setSiteNameTemp(tempDataArr[0].Site);
            }
            setShowButton(true);
        }
    },[isLoading])

    return (
        <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select className="select-drop" onChange={(e) => {setIdTemp(e.target.value); setShowButton(false)}}>
                    <option value="1">LA-03</option>
                    <option value="2">NR-02</option>
                    <option value="3">OA-04</option>
                    <option value="4">OA-01</option>
                    <option value="5">UA-06</option>
                    <option value="7">UA-07</option>
                    <option value="6">UA-08</option>
                </select>
            </div>
            <div className='date-container1'>
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
            </div>
            <button className="submitButton" onClick={setGraphDates}>Submit</button>

        {isLoading && <center>Fetching Data...</center>}
        {isLoading && <center>Fetching Data...</center>}
        {!isLoading && oxygenDataArr.length !== 0 && showButton && 
        <CSVLink 
            data={oxycsv} 
            filename = {siteNameOxy + "_" + startGraphDate.toLocaleDateString().replace(/\//g, '-') + "_" + endGraphDate.toLocaleDateString().replace(/\//g, '-') + ".csv"} 
            className="csv-link" target="_blank">
                Download Lake Oxygen Data
            </CSVLink>}
        {!isLoading && oxygenDataArr.length === 0 && <p>There is no lake oxygen data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        {!isLoading && tempDataArr.length !== 0 && showButton && <CSVLink data={tempcsv} filename = {siteNameTemp + "_" + startGraphDate.toLocaleDateString().replace(/\//g, '-') + "_" + endGraphDate.toLocaleDateString().replace(/\//g, '-')+".csv"} className="csv-link" target="_blank">Download Lake Temperature Data</CSVLink>}
        {!isLoading && tempDataArr.length === 0 && <p>There is no lake temperature data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        {((!isLoading && oxygenDataArr.length !==0) || (!isLoading && tempDataArr.length !== 0)) && showButton && <a href={require("../../../Metadata/README_tchain.txt")} download="README_Tchain.txt">Download Tchain Metadata README</a>}

        </center>
    </>
    )
}

export default TChainData;