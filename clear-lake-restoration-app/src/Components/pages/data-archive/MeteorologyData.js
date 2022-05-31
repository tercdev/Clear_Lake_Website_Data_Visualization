import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'use-http';
import DatePicker from 'react-datepicker';
import { convertDate,isAllEmpty } from '../../utils';
import Multiselect from 'multiselect-react-dropdown';

/**
 * Component showing the Meteorology data download.
 * @param {String} id 'clean' or 'real'
 * @param {String} url url of the API without query parameters
 * @param {Array} variables in the dataset
 * @returns {JSX.Element}
 */
function MeteorologyData(props) {
    const [showButton, setShowButton] = useState(false);
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);

    const [isLoading, setIsLoading] = useState(true);
    const [metData,setMetData] = useState([]);
    const [siteName, setSiteName] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);

    function handleStartDateChange(e) {
        setStartDate(e);
        setShowButton(false);
    }
    function handleEndDateChange(e) {
        setEndDate(e);
        setShowButton(false);
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

    if (props.id == "Clean") {
        start = "start";
        end = "end";
    } else {
        start = "rptdate";
        end = "rptend";
    }


    const metDataURL = useFetch(props.url);

    // fetches data every time graphDates change
    useEffect(()=> {
        // make sure data is set to empty
        setMetData([]);

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime();
        let diffDay = diffTime/(1000*3600*24);

        let metDataFetch = [];

        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 150) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            diffTime = endGraphDate.getTime() - newDay.getTime();
            diffDay = diffTime/(1000*3600*24);

            metDataFetch.push(metDataURL.get(`?id=${id}&${start}=${convertDate(compareDate)}&${end}=${convertDate(newDay)}`));


            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 151));
            compareDate = newDayPlusOne;

        }
        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        metDataFetch.push(metDataURL.get(`?id=${id}&${start}=${convertDate(compareDate)}&${end}=${convertDate(endDayPlusOne)}`));
        setIsLoading(true); // Loading is true
        async function fetchData() {
            metDataFetch = await Promise.all(metDataFetch);

            isAllEmpty(metDataFetch) ? setIsEmpty(true) : setIsEmpty(false)

            // combine all fetched arrays of data
            let metDataComb = [].concat.apply([],metDataFetch);

            setMetData(metDataComb);
            setIsLoading(false);
        }

        fetchData();

    },[startGraphDate,endGraphDate])

    const [realTimeData, setRealTimeData] = useState([])
    
    const [headers, setHeaders] = useState([])
    const [checkedState, setCheckedState] = useState(
        new Array(props.variables.length).fill(true)
    );
    const [selectedVariables, setSelectedVariables] = useState(
        new Array(props.variables.length).fill(true)
    );
    
    useEffect(()=> {
        if (!isLoading && !isEmpty) {
            // select variables
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(props.variables[index]);
                }
            });
            setHeaders(h);
            let selectedRealTimeData = [];
            
            metData.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[props.variables[index]]);
                    }
                })
                selectedRealTimeData.push(oneRow);
            }));

            setRealTimeData(selectedRealTimeData);
            setSiteName(metData[0].Station_ID)
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
                avoidHighlightFirstOption={true}
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

        {!isLoading && !isEmpty && showButton && <>
        <CSVLink 
            data={realTimeData}
            className="csv-link"
            target="_blank" 
            headers={headers}
            filename={siteName+"_"+startGraphDate.toISOString().slice(0,10)+"_"+endGraphDate.toISOString().slice(0,10)}
            >
                Download {props.id} Met Data
        </CSVLink></>}

        {props.id == "Real Time" ? 
            !isLoading && !isEmpty && showButton && <a href={require("../../../Metadata/README_realtime_met.txt")} download="README_realtime_met">Download {props.id} Meteorology Metadata README</a>
            : !isLoading && !isEmpty && showButton && <a href={require("../../../Metadata/README_clean_met.txt")} download="README_clean_met">Download {props.id} Meteorology Metadata README</a>}
        
        {!isLoading && isEmpty && <p>There is no {props.id.toLowerCase()} meterology data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        </center>
    </>
    )
}

export default MeteorologyData;