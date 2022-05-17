import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';
import Multiselect from 'multiselect-react-dropdown';

function MeterologyData(props) {
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
            var latestDate = new Date(new Date(startDate).setDate(150));
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
    var met_url = new URL(props.url);
    console.log(met_url);
    let met_params = met_url.searchParams;
    met_params.set('id',id);

    if (props.id == "Clean") {
        met_params.set('start', convertDate(startGraphDate));
        met_params.set('end', convertDate(endGraphDate));
    } else {
        // let oldestDate = new Date(new Date().setDate(endGraphDate.getDate() - 150));
        // if (startGraphDate < oldestDate) {
        //     met_params.set('rptdate', convertDate(oldestDate));
        // } else {
        //     met_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
        // }
        met_params.set('rptdate', convertDate(startGraphDate)); // at most 150 days away from endDate
        met_params.set('rptend', convertDate(endGraphDate));
    }

    met_url.search = met_params.toString();


    const realTime = useFetch(met_url.toString());

    const [realTimeData, setRealTimeData] = useState([])
    
    const [headers, setHeaders] = useState([])
    const [checkedState, setCheckedState] = useState(
        new Array(props.variables.length).fill(true)
    );
    const [selectedVariables, setSelectedVariables] = useState(
        new Array(props.variables.length).fill(true)
    );
    // const handleCheckBoxOnChange = (position) => {
    //     const updatedCheckedState = checkedState.map((item, index) =>
    //         index === position ? !item : item
    //     );
    //     setCheckedState(updatedCheckedState);
    //     setShowButton(false);
    // }
    useEffect(()=> {
        if (!realTime.isLoading) {
            // select variables
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(props.variables[index]);
                }
            });
            setHeaders(h);
            let selectedRealTimeData = [];
            
            realTime.data.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[props.variables[index]]);
                    }
                })
                selectedRealTimeData.push(oneRow);
            }));
            console.log(selectedRealTimeData)
            setRealTimeData(selectedRealTimeData);
            setShowButton(true);
        }
    },[realTime.isLoading,selectedVariables])
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
    <>
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select className="select-drop" onChange={(e) => {setIdTemp(e.target.value); setShowButton(false);}}>
                    <option value="1">Buckingham Point</option>
                    <option value="2">Clearlake Oaks</option>
                    <option value="3">Jago Bay</option>
                    <option value="4">Konocti Bay</option>
                    <option value="5">Nice</option>
                    <option value="6">North Lakeport</option>
                    <option value="7">Big Valley Rancheria</option>
                </select>
            </div>
            <Multiselect
                options={options}
                displayValue="name"
                onKeyPressFn={function noRefCheck(){}}
                onRemove={onRemove}
                onSearch={function noRefCheck(){}}
                onSelect={onSelect}
                selectedValues={options}
                className="multi-select"
            />
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
                    minDate={new Date("2019/01/01")}
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
            {error && <p className='error-message'>Selected date range was more than {props.id == "Clean" ? 365 : 150} days. End date was automatically changed.</p>}
        {realTime.isLoading && <center>Fetching Data...</center>}
        {!realTime.isLoading && realTimeData.length != 0 && showButton && <><CSVLink data={realTimeData} className="csv-link" target="_blank" headers={headers}>Download {props.id} Met Data</CSVLink></>}
        {props.id == "Real Time" ? 
            !realTime.isLoading && realTimeData.length != 0 && showButton && <a href={require("../../../Metadata/README_realtime_met.txt")} download="README_realtime_met">Download {props.id} Meteorology Metadata README</a>
            : !realTime.isLoading && realTimeData.length != 0 && showButton && <a href={require("../../../Metadata/README_clean_met.txt")} download="README_clean_met">Download {props.id} Meteorology Metadata README</a>}
        
        {!realTime.isLoading && realTimeData.length == 0 && <p>There is no {props.id.toLowerCase()} meterology data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        </center>
    </>
    )
}

export default MeterologyData;