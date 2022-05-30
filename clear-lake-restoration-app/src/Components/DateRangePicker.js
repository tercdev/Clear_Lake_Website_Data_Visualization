import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css"

/**
 * Component for showing the date picker with start date, end date, temperature unit toggle, and submit button.
 * @param {Date} startDate date of first date picker
 * @param {Date} endDate date of second date picker
 * @param {function(Date)} handleStartDateChange function that handles the event that the user changes the start date
 * @param {function(Date)} handleEndDateChange function that handles the event that the user changes the end date
 * @param {String} unit 'f' or 'c'
 * @param {function()} handleF function that handles the event that the user selects radio input for Fahrenheit
 * @param {function()} handleC function that handles the event that the user selects radio input for Celcius
 * @param {function()} setGraphDates function that handles the event that the user clicks the submit button
 * @returns {JSX.Element}
 */
function DateRangePicker(props) {
    const today = new Date();
    return (
        <div className='date-container'>
            <div className='one-date-container'>
            <p className='date-label'>Start Date</p>
            <DatePicker
                selected={props.startDate}
                onChange={props.handleStartDateChange}
                selectsStart
                startDate={props.startDate}
                endDate={props.endDate}
                maxDate={props.endDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={new Date("2018-10-02")}
            />
            </div>
            <div className='one-date-container'>
            <p className='date-label'>End Date</p>
            <DatePicker
                selected={props.endDate}
                onChange={props.handleEndDateChange}
                selectsEnd
                startDate={props.startDate}
                endDate={props.endDate}
                minDate={props.startDate}
                maxDate={today}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
            />
            </div>
            <div className='one-date-container'>
                <div className='radio-button'>
                    <input type="radio" value="f" id="f" onChange={props.handleF} name="unit" checked={props.unit=='f'}/>
                    <label htmlFor="f">°F</label>
                </div>
                <div className='radio-button'>
                    <input type="radio" value="c" id="c" onChange={props.handleC} name="unit" checked={props.unit=='c'}/>
                    <label htmlFor="c">°C</label>
                </div>
            </div>
            <div className='one-date-container'>
                <button className="submitButton" onClick={props.setGraphDates}>Submit</button>
            </div>
        </div>
    );
};

export default DateRangePicker;