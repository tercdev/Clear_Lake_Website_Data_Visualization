import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import useFetch from 'react-fetch-hook';
import DatePicker from 'react-datepicker';
import { convertDate } from '../../utils';
import Multiselect from 'multiselect-react-dropdown';

function MeterologyData(props) {
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
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
        setId(idTemp);
        setSelectedVariables(checkedState);
    }
    const [idTemp, setIdTemp] = useState(1);
    const [id, setId] = useState(1);
    var real_time_url = new URL(props.url);
    let real_search_params = real_time_url.searchParams;
    real_search_params.set('id',id);

    // console.log(startGraphDate);
    if (props.id == "Clean") {
        real_search_params.set('start', convertDate(startGraphDate));
        real_search_params.set('end', convertDate(endGraphDate));
    } else {
        let oldestDate = new Date(new Date().setDate(endGraphDate.getDate() - 150));
        if (startGraphDate < oldestDate) {
            real_search_params.set('rptdate', convertDate(oldestDate));
        } else {
            real_search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
        }
        real_search_params.set('rptend', convertDate(endGraphDate));
    }

    real_time_url.search = real_search_params.toString();


    const realTime = useFetch(real_time_url.toString());

    const [realTimeData, setRealTimeData] = useState([])
    
    const variables = ["Station_ID","DateTime_UTC","Air_Temp","Hi_Air_Temp","Low_Air_Temp","Rel_Humidity","Dew_Point","Wind_Speed","Wind_Dir","Hi_Wind_Speed","Hi_Wind_Speed_Dir","Atm_Pres","Rain","Rain_Rate","Solar_Rad","Solar_Energy"];
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
        setShowButton(false);
    }
    useEffect(()=> {
        if (!realTime.isLoading) {
            // select variables
            let h = [];
            selectedVariables.map((x,index) => {
                if (x) {
                    h.push(variables[index]);
                }
            });
            setHeaders(h);
            let selectedCleanData = [];
            let selectedRealTimeData = [];
            
            // console.log(data)
            // console.log(realTime.data)
            realTime.data.forEach((element => {
                let oneRow = [];
                selectedVariables.map((x,index) => {
                    if (x) {
                        oneRow.push(element[variables[index]]);
                    }
                })
                selectedRealTimeData.push(oneRow);
            }));
            console.log(selectedRealTimeData)
            setRealTimeData(selectedRealTimeData);
            setShowButton(true);
        }
    },[realTime.isLoading,selectedVariables])
    const options = variables.map((x,index) => {return {name: x, id: index}})
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
                <select onChange={(e) => {setIdTemp(e.target.value); setShowButton(false);}}>
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
            />
            {/* <div className='variables-container'>
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
            </div> */}
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
        
        {realTime.isLoading && <center>Fetching Data...</center>}
        {!realTime.isLoading && realTimeData.length != 0 && showButton && <><CSVLink data={realTimeData} className="csv-link" target="_blank" headers={headers}>Download {props.id} Met Data</CSVLink></>}
        {!realTime.isLoading && realTimeData.length == 0 && <p>There is no {props.id.toLowerCase()} meterology data from {startGraphDate.toDateString()} to {endGraphDate.toDateString()}.</p>}
        </center>
    </>
    )
}

export default MeterologyData;