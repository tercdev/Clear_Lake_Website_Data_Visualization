import React, { useState } from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css"

import { addDays, subDays } from './utils';

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
                // minDate={subDays(props.endDate, props.maxDays)}
                maxDate={props.endDate}
                // includeDateIntervals
                // date range using input w clear button
                showMonthDropdown
                showYearDropdown
                // yearDropdownItemNumber={today.getFullYear()-2019}
                dropdownMode="select"
                minDate={new Date("2019-01-02")}
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
                // maxDate={addDays(props.startDate, props.maxDays, today)}
                maxDate={today}
                showMonthDropdown
                showYearDropdown
                // yearDropdownItemNumber={today.getFullYear()-2019}
                dropdownMode="select"
            />
            </div>
            <div className='one-date-container'>
                <input type="radio" value="f" id="f" onChange={props.handleF} name="unit" />
                <label htmlFor="f">°F</label>

                <input type="radio" value="c" id="c" onChange={props.handleC} name="unit"/>
                <label htmlFor="c">°C</label>
            </div>
            <div className='one-date-container'>
                <button className="submitButton" onClick={props.setGraphDates}>Submit</button>
            </div>
        </div>
    );
};

export default DateRangePicker;