import React, { useEffect, useState, useRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';

function SpecificDateSelect(props) {
    const [year, setYear] = useState([]);
    const [month, setMonth] = useState([]);
    const [day, setDay] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedDay, setSelectedDay] = useState();
    
    const yearRef = useRef(null)
    const monthRef = useRef(null)
    const dayRef = useRef(null)
    function resetValues(r) {
        r.current.resetSelectedValues();
    }

    useEffect(() => {
        if (!props.isLoading) {
            let m = [];
            props.data.forEach((element => {
                m.push(new Date(element["DateTime_UTC"]));
            }))
            setDates(m);
            console.log(m)
            // console.log(includedDates.data)
            let datesByYear = {}
            console.log(dates)
            m.forEach((element) => {
                console.log(element);
                if (!(element.getFullYear() in datesByYear)) {
                    datesByYear[element.getFullYear()] = [];
                }
                let m = datesByYear[element.getFullYear()];
                m.push(element);
                datesByYear[element.getFullYear()] = m;
            })
            console.log(datesByYear);
            setYear(Object.keys(datesByYear));
        }
    },[props.isLoading])
    // separate dates by year
    
    
    function handleYearChange(e) {
        // setYear(e[0])
        let datesByYear = {}
        console.log(dates)
        dates.forEach((element) => {
            console.log(element);
            if (!(element.getFullYear() in datesByYear)) {
                datesByYear[element.getFullYear()] = [];
            }
            let m = datesByYear[element.getFullYear()];
            m.push(element);
            datesByYear[element.getFullYear()] = m;
        })
        console.log(datesByYear);
        let allDates = datesByYear[e[0]];
        let m = []
        allDates.forEach((element) => {
            let name = element.toLocaleString("en-US", { month: "long" })
            if (!(m.includes(name))) {
                m.push(name)
            }
        })
        setMonth(m)
        setSelectedYear(e[0])
        // setDay([])
        resetValues(dayRef)
        resetValues(monthRef)
    }
    function handleMonthChange(e) {
        console.log(e[0]) // string 'Month'
        let datesByYear = {}
        console.log(dates)
        dates.forEach((element) => {
            console.log(element);
            if (!(element.getFullYear() in datesByYear)) {
                datesByYear[element.getFullYear()] = [];
            }
            let m = datesByYear[element.getFullYear()];
            m.push(element);
            datesByYear[element.getFullYear()] = m;
        })
        console.log(datesByYear);
        let allDates = datesByYear[selectedYear];
        let m = []
        allDates.forEach((element) => {
            let name = element.toLocaleString("en-US", { month: "long" })
            if (name == e[0]) {
                m.push(element.getUTCDate())
                setSelectedMonth(element.getUTCMonth())
            }
        })
        setDay(m)
        resetValues(dayRef)
    }
    function handleDayChange(e) {
        setSelectedDay(e[0])
        let x = new Date(Date.UTC(selectedYear,selectedMonth,e[0]))
        console.log(selectedYear, selectedMonth, selectedDay, e[0],x)
        props.onSelect(x)
    }
    const style = {
        multiselectContainer: {
            width: '110px',
        },
        searchBox: {
            padding: 0
        },
        inputField: {
            width: '100%',
            "text-align": 'left',
            padding: '4px 10px',
            margin: 0,
            "font-size": '13px'
        },
        chips: {
            margin: 0
        }};

    return (
        <> 
            <div className='one-date-container'>
                <p className='date-label'>Year</p>
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
                    ref={yearRef}/>
            </div>
            <div className='one-date-container'>
                <p className='date-label'>Month</p>
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
                    ref={monthRef}/>
            </div>
            <div className='one-date-container'>
                <p className='date-label'>Day</p>
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
                    ref={dayRef} />
            </div>
        </>
    )
}

export default SpecificDateSelect;