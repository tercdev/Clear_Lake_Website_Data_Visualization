import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'use-http';
import DatePicker from 'react-datepicker';
import { convertDate, isAllEmpty } from '../../utils';
import Multiselect from 'multiselect-react-dropdown';

import './DataArchive.css'

/**
 * Component showing the Stream data download.
 * @param {String} id 'clean' or 'real'
 * @param {String} url url of the API without query parameters
 * @param {Array} variables in the dataset
 * @returns {JSX.Element}
 */
function StreamData(props) {
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);

    // State Variables
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    const [creekData,setCreekData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [siteName, setSiteName] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);
    const [showButton, setShowButton] = useState(false);

    function handleStartDateChange(e) {
        setStartDate(e);
        setShowButton(false)
    }

    function handleEndDateChange(e) {
        setEndDate(e);
        setShowButton(false)
    }

    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);

        setId(idTemp);
        let newArr = [];
        checkedState.forEach(x => newArr.push(x));
        setSelectedVariables(newArr);
    }

    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);

    let  start = "";
    let end = "";
    const creekDataURL = useFetch(props.url);

    if (props.id == "Clean") {
        start = "start"
        end = "end"
    } else if (props.id === "Real Time") {
        start = "rptdate"
        end = "rptend"
    } 
    
    // fetches data every time graphDates change
    useEffect(()=> {
        // make sure data is set to empty
        setCreekData([]);

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime();
        let diffDay = diffTime/(1000*3600*24);

        let creekDataFetch = [];


        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 150) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            diffTime = endGraphDate.getTime() - newDay.getTime();
            diffDay = diffTime/(1000*3600*24);

            creekDataFetch.push(creekDataURL.get(`?id=${id}&${start}=${convertDate(compareDate)}&${end}=${convertDate(newDay)}`));


            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 151));
            compareDate = newDayPlusOne;
        }
        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        creekDataFetch.push(creekDataURL.get(`?id=${id}&${start}=${convertDate(compareDate)}&${end}=${convertDate(endDayPlusOne)}`))
        setIsLoading(true); // Loading is true
        async function fetchData() {
            creekDataFetch = await Promise.all(creekDataFetch);

            // check if all returned arrays are empty
            isAllEmpty(creekDataFetch) ? setIsEmpty(true) : setIsEmpty(false);

            // combine all fetched arrays of data
            let creekDataComb = [].concat.apply([],creekDataFetch);

            setCreekData(creekDataComb);
            setIsLoading(false);
        }

        fetchData();

    },[startGraphDate,endGraphDate])

    const [creekcsv, setcreekcsv] = useState([]);
    
    const [headers, setHeaders] = useState([]);
    const [checkedState, setCheckedState] = useState(
        new Array(props.variables.length).fill(true)
    );

    const [selectedVariables, setSelectedVariables] = useState(
        new Array(props.variables.length).fill(true)
    );

    // looks for any changes with isLoading so processing of data can occur
    useEffect(()=> {
        if (!isLoading && !isEmpty) {
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(props.variables[index]);
                }
            });
            setHeaders(h);
            let selectedCreekData = [];
            creekData.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[props.variables[index]]);
                    }
                })
                selectedCreekData.push(oneRow);
            }));
            setcreekcsv(selectedCreekData); 

            if (creekData[0].hasOwnProperty('Creek')) {
                setSiteName(creekData[0].Creek);
            } else {
                setSiteName(creekData[0].Station_ID)
            }

            setShowButton(true);
        }
    },[isLoading,selectedVariables])

    const options = props.variables.map((x,index) => {return {name: x, id: index}})
    function onSelect(_selectedList, selectedItem) {
        let temp = checkedState;
        temp[selectedItem.id] = true;
        setCheckedState(temp);
        setShowButton(false);
    }
    function onRemove(_selectedList, selectedItem) {
        let temp = checkedState;
        temp[selectedItem.id] = false;
        setCheckedState(temp);
        setShowButton(false);
    }
    return (
        <center>
            <div className='location-container'>
                <p className='date-label'>Location</p>
                <select className="select-drop" onChange={(e) => {setIdTemp(e.target.value); setShowButton(false);}}>
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
        
        {isLoading && <center>Fetching Data...</center>}

        {!isLoading && !isEmpty && showButton && 
        <CSVLink 
            data={creekcsv} 
            filename ={siteName+"_"+startGraphDate.toISOString().slice(0,10)+"_"+endGraphDate.toISOString().slice(0,10)} 
            className="csv-link" target="_blank" 
            headers={headers}>
                Download {props.id} Stream Data
        </CSVLink>}

        {props.id == "Real Time" ? 
            !isLoading && !isEmpty && showButton && <a href={require("../../../Metadata/README_realtime_streams.txt")} download="README_realtime_streams">Download {props.id} Stream Metadata README</a>
            : !isLoading && !isEmpty && showButton && <a href={require("../../../Metadata/README_clean_streams.txt")} download="README_clean_stream">Download {props.id} Stream Metadata README</a>}
        

        {!isLoading && isEmpty && <p>There is no {props.id.toLowerCase()} stream data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        
        </center>
    )
}

export default StreamData;