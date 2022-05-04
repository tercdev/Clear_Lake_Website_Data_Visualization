import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css"

function DateRangePicker(props) {
    const today = new Date();
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
                minDate={subDays(props.endDate, props.maxDays)}
                maxDate={props.endDate}
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
                maxDate={addDays(props.startDate, props.maxDays, today)}
            />
            </div>
            <div className='one-date-container'>
                <button className="submitButton" onClick={props.setGraphDates}>Submit</button>
            </div>
            
        </div>
    );
};

export default DateRangePicker;