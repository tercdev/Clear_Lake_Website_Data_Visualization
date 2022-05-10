import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate, addDays, subDays } from '../../utils';
import Multiselect from 'multiselect-react-dropdown';

import './DataArchive.css'

function StreamData(props) {
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
        if (props.id == "Clean") {
            var latestDate = new Date(new Date(startDate).setDate(365));
        } else{
            var latestDate = new Date(new Date(startDate).setDate(180));
        } 
        setGraphStartDate(startDate);
        if (endDate > latestDate) {
            setError(true);
            setEndDate(latestDate);
            setGraphEndDate(latestDate);
        } else {
            setGraphEndDate(endDate);
        }
        setId(idTemp);
        let newArr = [];
        checkedState.forEach(x => newArr.push(x));
        setSelectedVariables(newArr);
    }
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);
    var url = new URL(props.url);
    
    var search_params = url.searchParams;
    search_params.set('id',id);
    if (props.id == "Clean") {
        search_params.set('start', convertDate(startGraphDate));
        search_params.set('end', convertDate(endGraphDate));
    } else {
        // let oldestDate = new Date(new Date().setDate(endGraphDate.getDate() - 180));
        // if (startGraphDate < oldestDate) {
        //     search_params.set('rptdate', convertDate(oldestDate));
        // } else {
        //     search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
        // }
        search_params.set('rptdate', convertDate(startGraphDate));
        search_params.set('rptend',convertDate(endGraphDate));
    }
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
        setShowButton(false)
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
            setShowButton(true);
        }
    },[creekData.isLoading,selectedVariables])
    const options = props.variables.map((x,index) => {return {name: x, id: index}})
    function onSelect(selectedList, selectedItem) {
        let temp = checkedState;
        temp[selectedItem.id] = true
        setCheckedState(temp)
        setShowButton(false)
    }
    function onRemove(selectedList, selectedItem) {
        let temp = checkedState
        temp[selectedItem.id] = false
        setCheckedState(temp)
        setShowButton(false)
    }
    return (
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select onChange={(e) => {setIdTemp(e.target.value); setShowButton(false);}}>
                    <option value="1">Kelsey Creek</option>
                    <option value="2">Middle Creek</option>
                    <option value="3">Scotts Creek</option>
                </select>
            </div>
            <Multiselect
                options={options}
                displayValue="name"
                onKeyPressFn={function noRefCheck(){}}
                onRemove={onRemove}
                onSearch={function noRefCheck(){}}
                onSelect={onSelect}
            />
            <div className='one-date-container'>
            <p className='date-label'>Start Date</p>
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                minDate={new Date("2019/01/01")}
                // minDate={subDays(endDate, 180)}
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
                // maxDate={addDays(startDate, 180, today)}
                maxDate={today}
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
            />
            </div>
            <button className="submitButton" onClick={setGraphDates}>Submit</button>
            {error && <p className='error-message'>Selected date range was more than {props.id == "Clean" ? 365 : 180} days. End date was automatically changed.</p>}
        
        {creekData.isLoading && <center>Fetching Data...</center>}
        {!creekData.isLoading && creekData.data.length != 0 && showButton && <CSVLink data={creekcsv} className="csv-link" target="_blank" headers={headers}>Download {props.id} Stream Data</CSVLink>}
        {props.id == "Real Time" ? 
            !creekData.isLoading && creekData.data.length != 0 && showButton && <a href={require("../../../Metadata/README_realtime_streams.txt")} download="README_realtime_streams">Download {props.id} Stream Metadata README</a>
            : !creekData.isLoading && creekData.data.length != 0 && showButton && <a href={require("../../../Metadata/README_clean_streams.txt")} download="README_clean_stream">Download {props.id} Stream Metadata README</a>}
        

        {!creekData.isLoading && creekData.data.length == 0 && <p>There is no {props.id.toLowerCase()} stream data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        
        </center>
    )
}

export default StreamData;