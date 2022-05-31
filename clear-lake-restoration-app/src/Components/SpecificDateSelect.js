import React, { useEffect, useState, useRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';

/**
 * Component for showing the year, month, date selector.  
 * https://www.npmjs.com/package/multiselect-react-dropdown
 * @param {Array} data
 * @param {boolean} isLoading whether the data is still being fetched or not
 * @param {function(Date)} onSelect callback function with input parameter as the final date
 * @returns {JSX.Element}
 */
function SpecificDateSelect(props) {
    // all the dates
    const [dates, setDates] = useState([]);
    // options for year dropdown
    const [year, setYear] = useState([]);
    // options for month dropdown
    const [month, setMonth] = useState([]);
    // options for day dropdown
    const [day, setDay] = useState([]);
    // selected values
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedDay, setSelectedDay] = useState();
    
    // references for each multiselect
    const yearRef = useRef(null)
    const monthRef = useRef(null)
    const dayRef = useRef(null)

    /**
     * Clear the values shown in the multiselect
     * @param {Object} r reference to a specific multiselect component
     */
    function resetValues(r) {
        r.current.resetSelectedValues();
    }

    useEffect(() => {
        if (!props.isLoading) {
            /**
             * Array of all dates
             */
            let m = [];
            // extract the dates
            props.data.forEach((element => {
                m.push(new Date(element["DateTime_UTC"]));
            }))
            setDates(m);
            /**
             * Dates grouped by year
             * `Year`: `[Date,Date,...]`
             */
            let datesByYear = {}
            // group dates by year
            m.forEach((element) => {
                if (!(element.getFullYear() in datesByYear)) {
                    datesByYear[element.getFullYear()] = [];
                }
                let n = datesByYear[element.getFullYear()];
                n.push(element);
                datesByYear[element.getFullYear()] = n;
            })
            // set year dropdown values
            setYear(Object.keys(datesByYear));
            resetValues(yearRef);
            resetValues(monthRef);
            resetValues(dayRef);
        }
    },[props.isLoading])
    
    /**
     * Handles when the user selects a year.  
     * Populate the month dropdown.
     * @param {Array} e where e[0] is the selected year as string
     */
    function handleYearChange(e) {
        /**
         * Dates grouped by year
         * `Year`: `[Date,Date,...]`
         */
        let datesByYear = {}
        // group dates by year
        dates.forEach((element) => {
            if (!(element.getFullYear() in datesByYear)) {
                datesByYear[element.getFullYear()] = [];
            }
            let n = datesByYear[element.getFullYear()];
            n.push(element);
            datesByYear[element.getFullYear()] = n;
        })
        /**
         * all the dates of the selected year
         */
        let allDates = datesByYear[e[0]];
        /**
         * Array of the months of allDates
         */
        let m = []
        allDates.forEach((element) => {
            let name = element.toLocaleString("en-US", { month: "long" })
            if (!(m.includes(name))) {
                m.push(name)
            }
        })
        // set month dropdown values
        setMonth(m)
        // user selected the year
        setSelectedYear(e[0])
        // clear month and day selection
        resetValues(dayRef)
        resetValues(monthRef)
    }

    /**
     * Handles when the user selects a month.  
     * Populates the day dropdown.
     * @param {Array} e where e[0] is the selected month as a string
     */
    function handleMonthChange(e) {
        /**
         * Dates grouped by year
         * `Year`: `[Date,Date,...]`
         */
        let datesByYear = {}
        // group dates by year
        dates.forEach((element) => {
            console.log(element);
            if (!(element.getFullYear() in datesByYear)) {
                datesByYear[element.getFullYear()] = [];
            }
            let n = datesByYear[element.getFullYear()];
            n.push(element);
            datesByYear[element.getFullYear()] = n;
        })
        /**
         * all the dates of the selected year
         */
        let allDates = datesByYear[selectedYear];
        /**
         * Array of the dates in UTC of allDates
         */
        let m = []
        allDates.forEach((element) => {
            let name = element.toLocaleString("en-US", { month: "long" })
            if (name === e[0]) {
                m.push(element.getUTCDate())
                // user selected the month
                setSelectedMonth(element.getUTCMonth())
            }
        })
        // set day dropdown values
        setDay(m)
        // clear day selection
        resetValues(dayRef)
    }

    /**
     * Handles when the user selects a day.  
     * Pass the complete date back to the component that uses this component.
     * @param {Array} e where e[0] is the selected day as a number
     */
    function handleDayChange(e) {
        // user selected the day
        setSelectedDay(e[0]);
        /**
         * Final date in UTC
         */
        let x = new Date(Date.UTC(selectedYear,selectedMonth,e[0]))
        props.onSelect(x)
    }

    /**
     * styling for multiselect component
     */
    const style = {
        multiselectContainer: {
            width: '110px',
        },
        searchBox: {
            padding: 0
        },
        inputField: {
            width: '100%',
            textAlign: 'left',
            padding: '4px 10px',
            margin: 0,
            fontSize: '1rem'
        },
        chips: {
            margin: 0
        }
    };

    return (
        <> 
            <div className='one-date-container'>
                <Multiselect 
                    options={year}
                    singleSelect 
                    isObject={false} 
                    onKeyPressFn={function noRefCheck(){}}
                    onRemove={function noRefCheck(){}}
                    onSearch={function noRefCheck(){}}
                    onSelect={handleYearChange}
                    emptyRecordMsg={"N/A"}
                    avoidHighlightFirstOption={true}
                    style={style} 
                    ref={yearRef}
                    placeholder={"Year"}/>
            </div>
            <div className='one-date-container'>
                <Multiselect 
                    options={month}
                    singleSelect 
                    isObject={false} 
                    onKeyPressFn={function noRefCheck(){}}
                    onRemove={function noRefCheck(){}}
                    onSearch={function noRefCheck(){}}
                    onSelect={handleMonthChange}
                    emptyRecordMsg={"N/A"}
                    avoidHighlightFirstOption={true} 
                    style={style} 
                    ref={monthRef}
                    placeholder={"Month"}/>
            </div>
            <div className='one-date-container'>
                <Multiselect 
                    options={day}
                    singleSelect 
                    isObject={false} 
                    onKeyPressFn={function noRefCheck(){}}
                    onRemove={function noRefCheck(){}}
                    onSearch={function noRefCheck(){}}
                    onSelect={handleDayChange}
                    emptyRecordMsg={"N/A"}
                    avoidHighlightFirstOption={true} 
                    style={style}
                    ref={dayRef} 
                    placeholder={"Date"}/>
            </div>
        </>
    )
}

export default SpecificDateSelect;