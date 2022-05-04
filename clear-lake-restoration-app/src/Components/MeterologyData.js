import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import DateRangePicker from './DateRangePicker';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';

function MeterologyData() {
    var today = new Date();
    console.log(today);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    console.log(lastWeek);
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
    var real_time_url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
    var clean_data_url = new URL('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');
    let real_search_params = real_time_url.searchParams;
    real_search_params.set('id',id);

    real_search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
    real_search_params.set('rptend', convertDate(endGraphDate));
    real_time_url.search = real_search_params.toString();

    var url = new URL('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('start',convertDate(startGraphDate));
    search_params.set('end',convertDate(endGraphDate));
    url.search = search_params.toString();

    var new_url = url.toString();
    const {isLoading,data} = useFetch(new_url);

    const realTime = useFetch(real_time_url.toString());

    const [cleanData, setCleanData] = useState([])
    const [realTimeData, setRealTimeData] = useState([])
    useEffect(()=> {
        console.log(isLoading)
        if (!isLoading && !realTime.isLoading) {
            setCleanData(data);
            setRealTimeData(realTime.data);   
        }
      },[isLoading, realTime.isLoading])
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
                    <option value="1">Buckingham Point</option>
                    <option value="2">Clearlake Oaks</option>
                    <option value="3">Jago Bay</option>
                    <option value="4">Konocti Bay</option>
                    <option value="5">Nice</option>
                    <option value="6">North Lakeport</option>
                    <option value="7">Big Valley Rancheria</option>
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
        
        {isLoading && <center>Fetching Data...</center>}
        {realTime.isLoading && <center>Fetching Data...</center>}
        {!isLoading && cleanData.length != 0 && <CSVLink data={cleanData} className="csv-link" target="_blank">Download Cleaned Met Data</CSVLink>}
        {!isLoading && cleanData.length == 0 && <p>There is no cleaned meterology data.</p>}
        {!realTime.isLoading && realTimeData.length != 0 && <CSVLink data={realTimeData} className="csv-link" target="_blank">Download Real Time Met Data</CSVLink>}
        {!realTime.isLoading && realTimeData.length == 0 && <p>There is no real time meterology data.</p>}
        </center>
    </>
    )
}

export default MeterologyData;