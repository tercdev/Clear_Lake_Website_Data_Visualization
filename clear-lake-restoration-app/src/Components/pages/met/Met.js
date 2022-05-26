import React, { useState, useEffect } from 'react';
// import useFetch from 'react-fetch-hook';
import Highcharts from 'highcharts';
import "react-datepicker/dist/react-datepicker.css";

import Chart from '../../Chart';
import DataDisclaimer from '../../DataDisclaimer.js';
import DateRangePicker from '../../DateRangePicker.js';
import CollapsibleItem from '../../CollapsibleItem';

import useFetch from 'use-http';
import { 
        convertDate, 
        convertGMTtoPSTTime,
        cardinalToDeg,
        removePast,
        removeExcess
     } from '../../utils.js';

let TIMEZONE_OFFSET = 7;
export default function Met(props) {
    const [unit, setUnit] = useState('f'); 
    const [graphUnit, setGraphUnit] = useState('f');
    
    function handleF(e) {
        setUnit('f')
    }
    function handleC(e) {
        setUnit('c')
    }
    
    // get data based on graph type
    function getFilteredData(data, dataType) {
        let m = [];
        data.forEach((element => {
             let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
            if (dataType === "Wind_Dir") {
                m.push([pstTime.getTime(), cardinalToDeg(element[dataType])]);
            } else if (dataType === "Air_Temp") {
                if (graphUnit === 'f') {
                    const fToCel= temp => Math.round( (temp *1.8 )+32 );
                    m.push([pstTime.getTime(), fToCel(parseFloat(element[dataType]))]);
                } else {
                    m.push([pstTime.getTime(), parseFloat(element[dataType])]);
                }
            } else {
                m.push([pstTime.getTime(), parseFloat(element[dataType])]);
            }
        }));

        m.sort(function(a,b) {
            return (a[0], b[0])
        })
        return m.reverse();
    }
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            height: 1500,
            events: {
                load() {
                    this.showLoading();
                }
            }
        },
        credits: {
            enabled: false
        },
        time: {
            useUTC: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>Clean data plotted on solid line. Provisional data plotted on dashed line.'
        },
        xAxis: [{
            type: 'datetime'
        }, {
            type: 'datetime',
            offset: 0,
            top: '-77%'
        }, {
            type: 'datetime',
            offset: 0,
            top: '-51.5%'
        }, {
            type: 'datetime',
            offset: 0,
            top: '-26%'
        }],
        yAxis: 
        [{ // Primary yAxis
            labels: {
                format: '{value}°F',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            title: {
                text: 'Air Temperature [°F]',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            opposite: true,
            height: '22.5%',
            offset: 0,
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
        }, { // Secondary yAxis
            title: {
                text: 'Relative Humidity [%]',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}%',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            height: '22.5%',
            offset: true,
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            // min: 0,
            max: 100
        }, {
            labels: {
                format: '{value} kPa',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            title: {
                text: 'Atmospheric Pressure [kPa]',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            lineColor: Highcharts.getOptions().colors[4],
            lineWidth: 5,
            height: '22.5%',
            offset: 0,
            top: '25.5%'
        }, { 
            title: {
                text: 'Wind Direction [degrees]',
                style: {
                    color: Highcharts.getOptions().colors[7]
                }
            },
            tickPositions: [0, 90, 180, 270, 360],
            labels: {
                formatter: function() {
                    var obj = {
                        0: 'North',
                        90: 'East',
                        180: 'South',
                        270: 'West',
                        360: 'North'
                    }
                return (obj[this.value])
                }
            },
            height: '22.5%',
            top: '51%',
            offset: 0,
            lineColor: Highcharts.getOptions().colors[7],
            lineWidth: 5,
            max: 360,
            tickInterval: 90
        }, { 
            labels: {
                format: '{value} m/s',
                style: {
                    color: Highcharts.getOptions().colors[5]
                }
            },
            title: {
                text: 'Wind Speed [m/s]',
                style: {
                    color: Highcharts.getOptions().colors[5]
                }
            },
            opposite: true,
            lineColor: Highcharts.getOptions().colors[5],
            lineWidth: 5,
            gridLineWidth: 0,
            height: '22.5%',
            offset: 0,
            top: '51%'
        }, {
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[6]
                }
            },
            title: {
                text: 'Solar Radiation [W/m2]',
                style: {
                    color: Highcharts.getOptions().colors[6]
                }
            },
            lineColor: Highcharts.getOptions().colors[6],
            lineWidth: 5,
            height: '22.5%',
            offset: 0,
            top: '77%'
        }],
        tooltip: {
            formatter: function() {
                const DayOfMonth = new Date(this.x).getDate();
                const Month = new Date(this.x).getMonth(); // Be careful! January is 0, not 1
                const Year = new Date(this.x).getFullYear();
                const TimeHrs = new Date(this.x).getHours();
                const TimeMins = new Date(this.x).getMinutes();
                const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + (TimeHrs<10?'0':'') + TimeHrs + ":" + (TimeMins<10?'0':'')+TimeMins;
                let units = {
                    "Air Temperature in °F": "°F",
                    "Air Temperature in °C": "°C",
                    "Relative Humidity": "%",
                    "Atmospheric Pressure": "kPa",
                    "Wind Direction": "degrees",
                    "Wind Speed": "m/s",
                    "Solar Radiation": "W/m2"
                }
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' +
                        point.y + ' ' + units[point.series.name];
                }, '<b>' + dateString + '</b>');
            },
            shared: true,
            followPointer: true
        },

        series: [
            {
                name: 'Air Temperature',
                data: [],
                selected: true,
                yAxis: 0,
                color: Highcharts.getOptions().colors[3],
            },
            {
                name: 'Relative Humidity',
                data: [],
                selected: true,
                yAxis: 1,
                color: Highcharts.getOptions().colors[0],
            },
            {
                name: 'Atmospheric Pressure',
                data: [],
                selected: true,
                yAxis: 2,
                color: Highcharts.getOptions().colors[4],
            },
            {
                name: 'Wind Direction',
                selected: true,
                yAxis: 3,
                color: Highcharts.getOptions().colors[7],
                type: 'spline',
                "lineWidth": 0,
                        "marker": {
                            "enabled": "true",
                            "states": {
                                "hover": {
                                "enabled": "true"
                                }
                            },
                            "radius": 3
                            },
                        "states": {
                            "hover": {
                            "lineWidthPlus": 0
                            }
                        },
            },
            {
                name: 'Wind Speed',
                data: [],
                selected: true,
                yAxis: 4,
                color: Highcharts.getOptions().colors[5],
            },     
            {
                name: 'Solar Radiation',
                data: [],
                selected: true,
                yAxis: 5,
                color: Highcharts.getOptions().colors[6],
            },           
        ],
        updateTime: {
            setTime: 0,
            endTime: 0,
        },
    });

    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [realTime_arr,setRealTimeArr] = useState([])
    const [cleanMet_arr,setCleanMetArr] = useState([])

    function handleStartDateChange(e) {
        setStartDate(e);
    }
    
    function handleEndDateChange(e) {
        setEndDate(e);
    }
   
    function setGraphDates() {
        setGraphUnit(unit);
        setError(false);
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
    }

    // endpoint provided by TERC
    const realTime = useFetch('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink')
    // endpoint that contains clean data
    const cleanMet = useFetch('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met')

    useEffect(()=> {
        setCleanMetArr([])
        setRealTimeArr([])

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime()
        let diffDay = diffTime/(1000*3600*24)

        let realTimeFetchlist =[]
        let cleanFetchList = []
        
        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 150) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            diffTime = endGraphDate.getTime() - newDay.getTime()
            diffDay = diffTime/(1000*3600*24)

            realTimeFetchlist.push(realTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(newDay)}`))
            cleanFetchList.push(cleanMet.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`))

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 151));
            compareDate = newDayPlusOne

        }
        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        realTimeFetchlist.push(realTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(endDayPlusOne)}`))
        cleanFetchList.push(cleanMet.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`))

        setIsLoading(true); // Loading is true

        realTimeFetchlist = realTimeFetchlist.reverse() // reverse api calls since data is returned in reverse order 

        async function fetchData() {
            // start with fetching any potential clean data
            let cleanArr = await Promise.all(
                cleanFetchList
                )

            let lastEndDate = new Date(endGraphDate)
            lastEndDate.setHours(23,59,0,0)
            lastEndDate.setTime(lastEndDate.getTime() + TIMEZONE_OFFSET*60*60*1000) // convert end date to pst time zone

            // if clean data is empty then move on with only realtime data
            if (cleanArr.length > 0 && cleanArr[0].length > 0 ) { 

                // check if any empty arrays 
                for (let j = 0;j< cleanArr.length;j++) {
                    if (cleanArr[j].length === 0) {
                        cleanArr.splice(j,1)
                    }
                }
                let lastArr = cleanArr.slice(-1)

                let lastDateofCleanData = new Date(lastArr[0].slice(-1)[0]['DateTime_UTC']) // get last date of clean data

                // if true then clean date is sufficient and no need for realtime
                if ( lastDateofCleanData >= endGraphDate) {
                    /* trim any extra hours, this is because we query for an extra UTC day, we must
                     remove a couple hours */

                    let trimData = removeExcess(cleanArr,lastEndDate.getTime())
                    setCleanMetArr(trimData)
                }
                else {
                    // fetch real time data if clean data doesn't cover the whole date
                    let realTimedata = await Promise.all(
                        realTimeFetchlist
                    )
                    let trimRealtimeData = removeExcess(realTimedata ,lastEndDate.getTime())
                    setRealTimeArr(trimRealtimeData)
                    setCleanMetArr(cleanArr)
                }
            }
            // only realtime data is necessary 
            else {
                
                let realTimearr =  await Promise.all(
                    realTimeFetchlist
                    )
                let trimRealData = removeExcess(realTimearr ,lastEndDate.getTime())
                setRealTimeArr(trimRealData)
            }

            setIsLoading(false); //loading is done
        }

        fetchData()
        
    },[startGraphDate,endGraphDate])

    useEffect(()=> {
        if (!isLoading) {

            let realTimeData = [].concat.apply([],realTime_arr)
            let cleanMetData = [].concat.apply([],cleanMet_arr)
    
            // if both arrays are empty then error
            if (cleanMetData.length !== 0 || realTimeData.length !== 0) { 
                // filter data into arrays
                let relHumidityData = getFilteredData(cleanMetData,"Rel_Humidity");
                let airTempData = getFilteredData(cleanMetData,"Air_Temp");
                let atmPresData = getFilteredData(cleanMetData,"Atm_Pres");
                let windSpeedData = getFilteredData(cleanMetData,"Wind_Speed");
                let windDirData = getFilteredData(cleanMetData,"Wind_Dir");
                let solarRadData = getFilteredData(cleanMetData,"Solar_Rad");
    
                let realTimeRelHumidityData = getFilteredData(realTimeData,"Rel_Humidity");
                let realTimeAirTempData = getFilteredData(realTimeData,"Air_Temp");
                let realTimeAtmPresData = getFilteredData(realTimeData, "Atm_Pres"); // start from lastdate
                let realTimeWindSpeedData = getFilteredData(realTimeData,"Wind_Speed");
                let realTimeWindDirData = getFilteredData(realTimeData,"Wind_Dir");            
                let realTimeSolarRadData = getFilteredData(realTimeData, "Solar_Rad"); // start from lastdate
    
                if (atmPresData.length !== 0 && realTimeAtmPresData.length !== 0) {
                    var lastdate = atmPresData[0][0];
                    let dataLastDate = new Date(atmPresData[0][0]);
                    let realDataLastDate = new Date(realTimeAtmPresData[0][0]);
    
                    if (dataLastDate.getFullYear() === realDataLastDate.getFullYear() && dataLastDate.getMonth() === realDataLastDate.getMonth() && dataLastDate.getDay() === realDataLastDate.getDay()) {
                        realTimeAtmPresData = []
                        realTimeRelHumidityData = []
                        realTimeAirTempData = []
                        realTimeWindSpeedData = []
                        realTimeWindDirData = []
                        realTimeSolarRadData = []
                        lastdate = undefined
                    }
                    realTimeAtmPresData = removePast(realTimeAtmPresData, lastdate);
                    realTimeRelHumidityData = removePast(realTimeRelHumidityData, lastdate);
                    realTimeAirTempData = removePast(realTimeAirTempData, lastdate);
                    realTimeWindSpeedData = removePast(realTimeWindSpeedData, lastdate);
                    realTimeWindDirData = removePast(realTimeWindDirData, lastdate);
                    realTimeSolarRadData = removePast(realTimeSolarRadData, lastdate);
                }
                
                let combinedAtmPresData = atmPresData.concat(realTimeAtmPresData);
                combinedAtmPresData.sort(function(a,b) {
                    return (a[0]-b[0])
                })
    
                let combinedRelHumidityData = relHumidityData.concat(realTimeRelHumidityData);
                combinedRelHumidityData.sort(function(a,b) {
                    return (a[0]-b[0])
                })
                let combinedAirTempData = airTempData.concat(realTimeAirTempData);
                combinedAirTempData.sort(function(a,b) {
                    return (a[0]-b[0])
                })
                let combinedWindSpeedData = windSpeedData.concat(realTimeWindSpeedData);
                combinedWindSpeedData.sort(function(a,b) {
                    return (a[0]-b[0])
                })
                let combinedWindDirData = windDirData.concat(realTimeWindDirData);
                combinedWindDirData.sort(function(a,b) {
                    return (a[0]-b[0])
                })
                let combinedSolarRadData = solarRadData.concat(realTimeSolarRadData);
                combinedSolarRadData.sort(function(a,b) {
                    return (a[0]-b[0])
                })
    
                let zoneProps = [];
                if (lastdate === undefined && realTimeAtmPresData.length !== 0) {
                    zoneProps = [{value: realTimeAtmPresData[0][0]},{dashStyle: 'dash'}]
                } else {
                    zoneProps = [{value: lastdate}, {dashStyle: 'dash'}]
                }
    
                let maxX = combinedAtmPresData[combinedAtmPresData.length-1][0];
                let minX = combinedAtmPresData[0][0];
                let ylabel = ''
                let yformat = ''
                let yseries = ''
                let maxTemp = 0;
    
                if (graphUnit === 'f') {
                    ylabel = 'Air Temperature [°F]'
                    yformat = '{value} °F'
                    yseries = 'Air Temperature in °F';
                    maxTemp = 120;
                } else {
                    ylabel = 'Air Temperature [°C]'
                    yformat = '{value} °C'
                    yseries = 'Air Temperature in °C'
                    maxTemp = 40;
                }
    
                setChartProps({...chartProps,
                    series: [
                    {
                        data: combinedAirTempData,
                        zoneAxis: 'x',
                        zones: zoneProps,
                        name: yseries
                    }, 
                    {
                        data: combinedRelHumidityData,
                        zoneAxis: 'x',
                        zones: zoneProps
                    },
                    {
                        data: combinedAtmPresData,
                        zoneAxis: 'x',
                        zones: zoneProps
                    },
                    {
                        data: combinedWindDirData,
                        zoneAxis: 'x',
                        zones: zoneProps
                    },
                    {
                        data: combinedWindSpeedData,
                        zoneAxis: 'x',
                        zones: zoneProps
                    },
                    {
                        data: combinedSolarRadData,
                        zoneAxis: 'x',
                        zones: zoneProps
                    },
                    ],
                    xAxis: [{
                        min: minX, max: maxX,
                    },{
                        min: minX, max: maxX,
                    },{
                        min: minX, max: maxX,
                    },{
                        min: minX, max: maxX,
                    }],
                    yAxis: [{
                        title: {
                            text: ylabel,
                            style: {
                                color: Highcharts.getOptions().colors[3]
                            }
                        },
                        labels: {
                            format: yformat,
                            style: {
                                color: Highcharts.getOptions().colors[3]
                            }
                        },
                        max: maxTemp
                    }, {
                    }, {}, {}, {}, {}]
                })
            }
        }
    },[isLoading,graphUnit])

    const header1 = "How to use the graphs and see the data below?";
    const content1 = [<ol>
            <li>Select start and end dates with maximum 365-day period. Time is in local pacific time.</li>
            <li>Click submit to update the graphs below.</li>
            <li>Graph and data loading will depend on the length of the selected time period.</li>
        </ol>];

    const header2 = "Why is no data showing up on my plots?";
    const content2 = [<p>If there is no data, please refer <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a> to read more about the metadata.</p>];


    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>
            <div className="collapsible-container">
                <CollapsibleItem header={header1} content={content1}/>
                <CollapsibleItem header={header2} content={content2}/>
            </div>

            <DateRangePicker 
                startDate={startDate} 
                endDate={endDate} 
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                setGraphDates={setGraphDates} 
                handleF={handleF}
                handleC={handleC}
                unit={unit}
            />
            {error && <p className='error-message'>Selected date range was more than 365 days. End date was automatically changed.</p>}
            <Chart 
                chartProps={chartProps}
                isLoading={isLoading}
             />
        </div>
        
    )
}