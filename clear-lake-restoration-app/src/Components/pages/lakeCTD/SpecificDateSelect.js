import React, { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';


function SpecificDateSelect(props) {
    const [year, setYear] = useState([]);
    const [month, setMonth] = useState([]);
    const [day, setDay] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedDay, setSelectedDay] = useState();
    
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
            // if (year == []) {
            setYear(Object.keys(datesByYear));
            // }
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
    }
    function handleDayChange(e) {
        setSelectedDay(e[0])
        let x = new Date(Date.UTC(selectedYear,selectedMonth,e[0]))
        console.log(selectedYear, selectedMonth, selectedDay, e[0],x)
        props.onSelect(x)
    }
    return (
        <>
            <Multiselect 
                options={year}
                singleSelect 
                isObject={false} 
                onKeyPressFn={function noRefCheck(){}}
                onRemove={function noRefCheck(){}}
                onSearch={function noRefCheck(){}}
                onSelect={handleYearChange} />
            <Multiselect 
                options={month}
                singleSelect 
                isObject={false} 
                onKeyPressFn={function noRefCheck(){}}
                onRemove={function noRefCheck(){}}
                onSearch={function noRefCheck(){}}
                onSelect={handleMonthChange} />
            <Multiselect 
                options={day}
                singleSelect 
                isObject={false} 
                onKeyPressFn={function noRefCheck(){}}
                onRemove={function noRefCheck(){}}
                onSearch={function noRefCheck(){}}
                onSelect={handleDayChange} />
            
        </>
    )
}

export default SpecificDateSelect;