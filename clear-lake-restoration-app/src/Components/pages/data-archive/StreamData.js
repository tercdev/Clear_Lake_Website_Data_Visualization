import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';

function StreamData() { 
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
        setSelectedVariables(checkedState);
    }
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);
    var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
    var flowurl = new URL('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams')

    var search_params_flow = flowurl.searchParams;
    search_params_flow.set('id',id);
    search_params_flow.set('start',convertDate(startGraphDate));
    search_params_flow.set('end',convertDate(endGraphDate));
    flowurl.search = search_params_flow.toString();
    var flow_new_url = flowurl.toString();
    
    const flowData = useFetch(flow_new_url);

    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('rptdate',convertDate(startGraphDate)); // at most 180 days
    search_params.set('rptend',convertDate(endGraphDate));
    url.search = search_params.toString();

    var new_url = url.toString();
    const creekData = useFetch(new_url);

    const [creekcsv, setcreekcsv] = useState([])
    const [flowcsv, setflowcsv] = useState([])
    
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
    function subDays(date, num) {
        return new Date(new Date().setDate(date.getDate() - num));
    }
    function addDays(date, num) {
        let x = new Date(new Date().setDate(date.getDate() + num));
        if (today < x) {
            return today
        } else {
            return x
        }
    }
    const variables = ["Creek","TmStamp","RecNum","Turb_BES","Turb_Mean","Turb_Median","Turb_Var","Turb_Min","Turb_Max","Turb_Temp"];
    const [headers, setHeaders] = useState([])
    const [checkedState, setCheckedState] = useState(
        new Array(variables.length).fill(false)
    );
    const [selectedVariables, setSelectedVariables] = useState(
        new Array(variables.length).fill(false)
    );
    const handleCheckBoxOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }
    useEffect(()=> {
        if ( !creekData.isLoading && !flowData.isLoading) {
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(variables[index]);
                }
            });
            setHeaders(h);
            let selectedCreekData = [];
            creekData.data.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[variables[index]]);
                    }
                })
                selectedCreekData.push(oneRow);
            }));
            setcreekcsv(selectedCreekData); 
            setflowcsv(flowData.data);                  
        }
    },[creekData.isLoading,flowData.isLoading,selectedVariables])
    return (
    <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select onChange={(e) => setIdTemp(e.target.value)}>
                    <option value="1">Kelsey Creek</option>
                    <option value="2">Middle Creek</option>
                    <option value="3">Scotts Creek</option>
                </select>
            </div>
            <div className='variables-container'>
                {variables.map((name,index)=> {
                    return (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={name}
                                value={name}
                                checked={checkedState[index]}
                                onChange={() => handleCheckBoxOnChange(index)}
                            />
                            <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                        </div>
                    )
                })}
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
                minDate={subDays(endDate, 180)}
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
                maxDate={addDays(startDate, 180, today)}
            />
            </div>
            <button className="submitButton" onClick={setGraphDates}>Submit</button>
        
        {creekData.isLoading && <center>Fetching Data...</center>}
        {flowData.isLoading && <center>Fetching Data...</center>}
        {!creekData.isLoading && creekData.data.length != 0 && <CSVLink data={creekcsv} className="csv-link" target="_blank" headers={headers}>Download Real Time Stream Data</CSVLink>}
        {!creekData.isLoading && creekData.data.length == 0 && <p>There is no real time stream data.</p>}
        {!flowData.isLoading && flowData.data.length != 0 && <CSVLink data={flowcsv} className="csv-link" target="_blank">Download Real Time Flow Data</CSVLink>}
        {!flowData.isLoading && flowData.data.length == 0 && <p>There is no real time flow data.</p>}
        <p>Real time data is limited to 180 days.</p>
        </center>
    </>
    )
}

export default StreamData;