import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate, addDays, subDays } from '../../utils';

function StreamData(props) {
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
    var url = new URL(props.url);
    
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('rptdate',convertDate(startGraphDate)); // at most 180 days
    search_params.set('rptend',convertDate(endGraphDate));
    url.search = search_params.toString();

    var new_url = url.toString();
    const creekData = useFetch(new_url);

    const [creekcsv, setcreekcsv] = useState([])
    
    // const variables = ["Creek","TmStamp","RecNum","Turb_BES","Turb_Mean","Turb_Median","Turb_Var","Turb_Min","Turb_Max","Turb_Temp"];
    const [headers, setHeaders] = useState([])
    const [checkedState, setCheckedState] = useState(
        new Array(props.variables.length).fill(false)
    );
    const [selectedVariables, setSelectedVariables] = useState(
        new Array(props.variables.length).fill(false)
    );
    const handleCheckBoxOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }
    useEffect(()=> {
        if (!creekData.isLoading) {
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(props.variables[index]);
                }
            });
            setHeaders(h);
            let selectedCreekData = [];
            creekData.data.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[props.variables[index]]);
                    }
                })
                selectedCreekData.push(oneRow);
            }));
            setcreekcsv(selectedCreekData); 
        }
    },[creekData.isLoading,selectedVariables])
    return (
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
                {props.variables.map((name,index)=> {
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
        {!creekData.isLoading && creekData.data.length != 0 && <CSVLink data={creekcsv} className="csv-link" target="_blank" headers={headers}>Download {props.id} Stream Data</CSVLink>}
        {!creekData.isLoading && creekData.data.length == 0 && <p>There is no {props.id.toLowerCase()} stream data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        
        </center>
    )
}

export default StreamData;