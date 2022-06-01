import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'use-http';
import DatePicker from 'react-datepicker';
import { convertDate,isAllEmpty } from '../../utils';
import Multiselect from 'multiselect-react-dropdown';

/**
 * Component showing the Meteorology data download.
 * @param {String} id 'Clean' or 'Real Time'
 * @param {String} url url of the API without query parameters
 * @param {Array} variables in the dataset
 * @returns {JSX.Element}
 */
function MeteorologyData(props) {
    // for the download button
    const [showButton, setShowButton] = useState(false);
    // set start date as a week ago and end date as today
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    // if data is still being fetched or not
    const [isLoading, setIsLoading] = useState(true);
    // data from API call
    const [metData,setMetData] = useState([]);
    // name in the csv
    const [siteName, setSiteName] = useState("");
    // if there is no data
    const [isEmpty, setIsEmpty] = useState(true);
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
        // set the final selected variables chosen by the user
        let newArr = [];
        checkedState.forEach(x => newArr.push(x));
        setSelectedVariables(newArr);
    }

    // initial id = 1
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);

    /**
     * name of the start date query parameter
     */
    let start = "";
    /**
     * name of the end date query parameter
     */
    let end = "";
    // clean and real time APIs have different query parameter names
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

        metDataFetch.push(metDataURL.get(`?id=${id}&${start}=${convertDate(compareDate)}&${end}=${convertDate(endGraphDate)}`));
        if (props.id === "Real Time") {
            metDataFetch = metDataFetch.reverse();
        }
        

        setIsLoading(true); // Loading is true

        async function fetchData() {
            metDataFetch = await Promise.all(metDataFetch);

            isAllEmpty(metDataFetch) ? setIsEmpty(true) : setIsEmpty(false)

            // combine all fetched arrays of data
            let metDataComb = [].concat.apply([],metDataFetch);
            if (props.id === "Real Time") {
                metDataComb = metDataComb.reverse();
            }

            setMetData(metDataComb);
            setIsLoading(false);
        }

        fetchData();

    },[startGraphDate,endGraphDate,id])

    // data in the csv
    const [metcsv, setmetcsv] = useState([]);
    // headers of csv
    const [headers, setHeaders] = useState([]);
    // initially all variables are selected
    // changes as user changes selection
    const [checkedState, setCheckedState] = useState(
        new Array(props.variables.length).fill(true)
    );
    // changes when user clicks submit
    const [selectedVariables, setSelectedVariables] = useState(
        new Array(props.variables.length).fill(true)
    );
    
    useEffect(()=> {
        if (!isLoading && !isEmpty) {
            /**
             * headers included in the csv
             */
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(props.variables[index]);
                }
            });
            setHeaders(h);
            /**
             * all the data where each row only contains user selected columns of metData
             */
            let selectedMetData = [];
            metData.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[props.variables[index]]);
                    }
                })
                selectedMetData.push(oneRow);
            }));

            setmetcsv(selectedMetData);
            setSiteName(metData[0].Station_ID);
            setShowButton(true);
        }
    },[isLoading,selectedVariables])

    /**
     * options for Multiselect
     */
    const options = props.variables.map((x,index) => {return {name: x, id: index}});
    /**
     * set state of selected item to true and hide button
     * @param {Array} _selectedList 
     * @param {Object} selectedItem 
     */
    function onSelect(_selectedList, selectedItem) {
        let temp = checkedState;
        temp[selectedItem.id] = true;
        setCheckedState(temp);
        setShowButton(false);
    }
    /**
     * set state of selected item to false and hide button
     * @param {Array} _selectedList 
     * @param {Object} selectedItem 
     */
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
            data={metcsv}
            className="csv-link"
            target="_blank" 
            headers={headers}
            filename={siteName+"_"+startGraphDate.toLocaleDateString().replace(/\//g, '-')+"_"+endGraphDate.toLocaleDateString().replace(/\//g, '-')}
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