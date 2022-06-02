import React, { useState, useEffect } from 'react';
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
        removeExcess,
        isAllEmpty,
        dateToDateTime
     } from '../../utils.js';

/**
 * difference in hours between GMT and PST
 */
const TIMEZONE_OFFSET = 7;

/**
 * Component for showing one site's meteorology page.
 * @param {String} id used in API call for a specific site
 * @param {String} name Title of the page
 * @returns {JSX.Element}
 */
export default function Met(props) {
    // fahrenheit by default
    const [unit, setUnit] = useState('f'); 
    const [graphUnit, setGraphUnit] = useState('f');

    // set to fahrenheit
    function handleF() {
        setUnit('f');
    }
    // set to celcius
    function handleC() {
        setUnit('c');
    }
    
    /**
     * Given a data array, return an array of [time, y] to be used for graphing
     * @param {Array} data 
     * @param {String} dataType "Rel_Humidity", "Air_Temp", "Atm_Pres", "Wind_Speed", "Wind_Dir", "Solar_Rad" 
     * @returns {Array} Array of arrays for graphing
     */
    function getFilteredData(data, dataType) {
        let m = [];
        data.forEach((element => {

           let newDate = dateToDateTime(element.DateTime_UTC)

            let pstTime = convertGMTtoPSTTime(newDate);
            if (dataType === "Wind_Dir") {
                m.push([pstTime.getTime(), cardinalToDeg(element[dataType])]);
            } else if (dataType === "Air_Temp") {
                if (graphUnit === 'f') { // fahrenheit
                    /**
                     * convert celcius to fahrenheit
                     * @param {number} temp temperature in celcius
                     * @returns {number} temperature in fahrenheit
                     */
                    const celToF = temp => Math.round((temp * 1.8) + 32);
                    m.push([pstTime.getTime(), celToF(parseFloat(element[dataType]))]);
                } else { // celcius by default
                    m.push([pstTime.getTime(), parseFloat(element[dataType])]);
                }
            } else {
                m.push([pstTime.getTime(), parseFloat(element[dataType])]);
            }
        }));
        // sort by date
        m.sort(function(a,b) {
            return (a[0]-b[0]);
        })
        return m;
    }

    /**
     * Initial state of all the chart properties.  
     */
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            height: 1500,
            events: {
                load() { // show Loading... text
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
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>Clean data plotted on solid line. Provisional data plotted on dashed line.',
            style: {
                fontSize: '1rem'
            }
        },
        exporting: {
            filename: props.name,
            buttons: {
                contextButton: {
                    menuItems: [
                        "viewFullscreen",
                        "printChart",
                        "viewData",
                        "separator",
                        "downloadPNG",
                        "downloadJPEG", 
                        "downloadSVG",
                        "downloadPDF",
                    ]
                }
            }
        },
        xAxis: [{ // for solar radiation (bottom chart)
            type: 'datetime',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, { // for wind chart (third chart)
            type: 'datetime',
            offset: 0,
            top: '-77%',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, { // for atm pres chart (second chart)
            type: 'datetime',
            offset: 0,
            top: '-51.5%',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, { // for rel humidity and air temp chart (top chart)
            type: 'datetime',
            offset: 0,
            top: '-26%',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }],
        yAxis: 
        [{ // for the top chart
            title: {
                text: 'Air Temperature [°F]',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}°F',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            opposite: true, // on the right side
            height: '22.5%',
            offset: 0,
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
        }, { // for the top chart
            title: {
                text: 'Relative Humidity [%]',
                style: {
                    color: Highcharts.getOptions().colors[0],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}%',
                style: {
                    color: Highcharts.getOptions().colors[0],
                    fontSize: '1rem'
                }
            },
            height: '22.5%',
            offset: 0,
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            max: 100 // max humidity
        }, { // for the second chart
            title: {
                text: 'Atmospheric Pressure [kPa]',
                style: {
                    color: Highcharts.getOptions().colors[4],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} kPa',
                style: {
                    color: Highcharts.getOptions().colors[4],
                    fontSize: '1rem'
                }
            },
            lineColor: Highcharts.getOptions().colors[4],
            lineWidth: 5,
            height: '22.5%',
            offset: 0,
            top: '25.5%'
        }, {  // for the third chart
            title: {
                text: 'Wind Direction [degrees]',
                style: {
                    color: Highcharts.getOptions().colors[7],
                    fontSize: '1rem'
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
                },
                style: {
                    fontSize: '1rem'
                }
            },
            height: '22.5%',
            top: '51%',
            offset: 0,
            lineColor: Highcharts.getOptions().colors[7],
            lineWidth: 5,
            max: 360, // max degrees
            tickInterval: 90
        }, {  // for the third chart
            title: {
                text: 'Wind Speed [m/s]',
                style: {
                    color: Highcharts.getOptions().colors[5],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} m/s',
                style: {
                    color: Highcharts.getOptions().colors[5],
                    fontSize: '1rem'
                }
            },
            opposite: true, // on the right side
            lineColor: Highcharts.getOptions().colors[5],
            lineWidth: 5,
            gridLineWidth: 0, // hide grid line
            height: '22.5%',
            offset: 0,
            top: '51%'
        }, { // for the bottom chart
            title: {
                text: 'Solar Radiation [W/m2]',
                style: {
                    color: Highcharts.getOptions().colors[6],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[6],
                    fontSize: '1rem'
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
                /**
                 * date as a number 1-31
                 */
                const DayOfMonth = new Date(this.x).getDate();
                /**
                 * month as a number between 0 and 11
                 */
                const Month = new Date(this.x).getMonth();
                /**
                 * full year as a number in the format YYYY
                 */
                const Year = new Date(this.x).getFullYear();
                /**
                 * hour in a date as a number
                 */
                const TimeHrs = new Date(this.x).getHours();
                /**
                 * minutes in a date as a number
                 */
                const TimeMins = new Date(this.x).getMinutes();
                /**
                 * date as string in format M-D-YYYY HH:MM
                 */
                const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + (TimeHrs < 10 ? '0' : '')
                     + TimeHrs + ":" + (TimeMins < 10 ? '0' : '') + TimeMins;
                /**
                 * Object that assigns each series a corresponding unit to be shown in the tooltip.  
                 * `series_name`: `unit`
                 */
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
            followPointer: true,
            style: {
                fontSize:'1rem'
            }
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
        legend: {
            verticalAlign: 'top', // legend at the top
            itemStyle: {
                fontSize: '1rem'
            }
        },
        updateTime: {
            setTime: 0,
            endTime: 0,
        },
    });

    // set start date as a week ago and end date as today
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);

    // hooks for if graph is loading
    const [isLoading, setIsLoading] = useState(true);

    // hooks for if data is empty
    const [isEmpty, setIsEmpty] = useState(true);

    // hooks for data array changes
    const [realTime_arr, setRealTimeArr] = useState([]);
    const [cleanMet_arr, setCleanMetArr] = useState([]);
    

    /**
     * set start date
     * @param {Date} e 
     */
    function handleStartDateChange(e) {
        if (typeof e !== Date) {
            setStartDate(e);
        }
    }

    /**
     * set end date
     * @param {Date} e 
     */
    function handleEndDateChange(e) {
        if (typeof e !== Date) {
            setEndDate(e);
        }
    }

    /**
     * set unit, start date, end date for the chart
     */
    function setGraphDates() {
        setGraphUnit(unit);
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
    }

    // endpoint provided by TERC
    const realTime = useFetch('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
    // endpoint that contains clean data
    const cleanMet = useFetch('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');

    useEffect(()=> {
        setCleanMetArr([]);
        setRealTimeArr([]);

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime();
        let diffDay = diffTime/(1000*3600*24);

        let realTimeFetchlist =[];
        let cleanFetchList = [];
        
        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 150) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            diffTime = endGraphDate.getTime() - newDay.getTime();
            diffDay = diffTime/(1000*3600*24);

            realTimeFetchlist.push(realTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(newDay)}`));
            cleanFetchList.push(cleanMet.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 151));
            compareDate = newDayPlusOne;

        }
        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        realTimeFetchlist.push(realTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(endDayPlusOne)}`));
        cleanFetchList.push(cleanMet.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`));

        setIsLoading(true); // Loading is true

        realTimeFetchlist = realTimeFetchlist.reverse(); // reverse api calls since data is returned in reverse order 

        async function fetchData() {
            // start with fetching any potential clean data
            let cleanArr = await Promise.all(cleanFetchList);

            let lastEndDate = new Date(endGraphDate);
            lastEndDate.setHours(23,59,0,0);
            lastEndDate.setTime(lastEndDate.getTime() + TIMEZONE_OFFSET*60*60*1000); // convert end date to pst time zone

            // if clean data is empty then move on with only realtime data
            if (cleanArr.length > 0 && cleanArr[0].length > 0 ) { 

                // check if any empty arrays 
                for (let j = 0;j< cleanArr.length;j++) {
                    if (cleanArr[j].length === 0) {
                        cleanArr.splice(j,1);
                    }
                }
                let lastArr = cleanArr.slice(-1);
                let lastDateofCleanData = new Date(lastArr[0].slice(-1)[0]['DateTime_UTC']); // get last date of clean data

                // if true then clean date is sufficient and no need for realtime
                if ( lastDateofCleanData >= endGraphDate) {
                    /* trim any extra hours, this is because we query for an extra UTC day, we must
                     remove a couple hours */
                    let trimData = removeExcess(cleanArr,lastEndDate.getTime());
                    setCleanMetArr(trimData);
                    isAllEmpty(trimData) ? setIsEmpty(true) : setIsEmpty(false);
                
                }
                else {
                    // fetch real time data if clean data doesn't cover the whole date
                    let realTimedata = await Promise.all(realTimeFetchlist);
                    let trimRealtimeData = removeExcess(realTimedata ,lastEndDate.getTime());
                    setRealTimeArr(trimRealtimeData);
                    setCleanMetArr(cleanArr);
                    if (isAllEmpty(realTimedata) && isAllEmpty(trimRealtimeData)) {
                        setIsEmpty(true);
                    } else {
                        setIsEmpty(false);
                    }
                }
            }
            // only realtime data is necessary 
            else {
                
                let realTimearr =  await Promise.all(realTimeFetchlist);
                let trimRealData = removeExcess(realTimearr ,lastEndDate.getTime());
                setRealTimeArr(trimRealData);
                isAllEmpty(trimRealData) ? setIsEmpty(true) : setIsEmpty(false);
            }

            setIsLoading(false); //loading is done
        }

        fetchData();
        
    },[startGraphDate,endGraphDate])

    useEffect(()=> {
        if (!isLoading) {

            let realTimeData = [].concat.apply([],realTime_arr);
            let cleanMetData = [].concat.apply([],cleanMet_arr);
    
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
                let realTimeAtmPresData = getFilteredData(realTimeData, "Atm_Pres");
                let realTimeWindSpeedData = getFilteredData(realTimeData,"Wind_Speed");
                let realTimeWindDirData = getFilteredData(realTimeData,"Wind_Dir");            
                let realTimeSolarRadData = getFilteredData(realTimeData, "Solar_Rad");
    
                if (atmPresData.length !== 0 && realTimeAtmPresData.length !== 0) {
                    var [lastdate] = atmPresData.slice(-1)[0];
                    let dataLastDate = new Date(lastdate);

                    let [reallastdate] = realTimeAtmPresData.slice(-1)[0]
                    let realDataLastDate = new Date(reallastdate);

                    if (dataLastDate.getFullYear() === realDataLastDate.getFullYear() && 
                        dataLastDate.getMonth() === realDataLastDate.getMonth() && 
                        dataLastDate.getDay() === realDataLastDate.getDay()) {
                        // don't need to use real time data
                        realTimeAtmPresData = [];
                        realTimeRelHumidityData = [];
                        realTimeAirTempData = [];
                        realTimeWindSpeedData = [];
                        realTimeWindDirData = [];
                        realTimeSolarRadData = [];
                        lastdate = undefined;
                    }
                    // remove all the data before lastdate
                    realTimeAtmPresData = removePast(realTimeAtmPresData, lastdate);
                    realTimeRelHumidityData = removePast(realTimeRelHumidityData, lastdate);
                    realTimeAirTempData = removePast(realTimeAirTempData, lastdate);
                    realTimeWindSpeedData = removePast(realTimeWindSpeedData, lastdate);
                    realTimeWindDirData = removePast(realTimeWindDirData, lastdate);
                    realTimeSolarRadData = removePast(realTimeSolarRadData, lastdate);
                }
                
                // sort by date
                let combinedAtmPresData = atmPresData.concat(realTimeAtmPresData);
                combinedAtmPresData.sort(function(a,b) {
                    return (a[0]-b[0]);
                })
                let combinedRelHumidityData = relHumidityData.concat(realTimeRelHumidityData);
                combinedRelHumidityData.sort(function(a,b) {
                    return (a[0]-b[0]);
                })
                let combinedAirTempData = airTempData.concat(realTimeAirTempData);
                combinedAirTempData.sort(function(a,b) {
                    return (a[0]-b[0]);
                })
                let combinedWindSpeedData = windSpeedData.concat(realTimeWindSpeedData);
                combinedWindSpeedData.sort(function(a,b) {
                    return (a[0]-b[0]);
                })
                let combinedWindDirData = windDirData.concat(realTimeWindDirData);
                combinedWindDirData.sort(function(a,b) {
                    return (a[0]-b[0]);
                })
                let combinedSolarRadData = solarRadData.concat(realTimeSolarRadData);
                combinedSolarRadData.sort(function(a,b) {
                    return (a[0]-b[0]);
                })
    
                /**
                 * define where the dashed line starts  
                 * https://api.highcharts.com/highcharts/plotOptions.series.zones.dashStyle
                 */
                let zoneProps = [];
                if (lastdate === undefined && realTimeAtmPresData.length !== 0) {
                    zoneProps = [{value: combinedAtmPresData[0][0]},{dashStyle: 'dash'}];
                } else {
                    zoneProps = [{value: lastdate}, {dashStyle: 'dash'}];
                }

                /**
                 * latest time
                 */
                let maxX = combinedAtmPresData[combinedAtmPresData.length-1][0];
                /**
                 * oldest time
                 */
                let minX = combinedAtmPresData[0][0];

                /**
                 * title of the y axis
                 */
                let ylabel = '';
                /**
                 * format of the y axis labels
                 */
                let yformat = '';
                /**
                 * name of the series
                 */
                let yseries = '';
                /**
                 * maximum temperature
                 */
                let maxTemp = 0;
                // set the variables depending on fahrenheit or celcius option 
                if (graphUnit === 'f') {
                    ylabel = 'Air Temperature [°F]';
                    yformat = '{value} °F';
                    yseries = 'Air Temperature in °F';
                    maxTemp = 120;
                } else {
                    ylabel = 'Air Temperature [°C]';
                    yformat = '{value} °C';
                    yseries = 'Air Temperature in °C';
                    maxTemp = 40;
                }
    
                // update chart properties with data
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
                });
            }
        }
    },[isLoading,graphUnit])

    // for collapsible FAQs
    const content = [
        {   
            id: "1",
            header: "How to use the graphs and see the data below?",
            content: <ol>
                <li>Select start and end dates. Local time is in PST.</li>
                <li>Click submit to update the graphs below.</li>
                <li>Graph and data loading will depend on the length of the selected time period. For example, longer time periods will result to longer loading times.</li>
                <p>*Note: Clean data is plotted on solid line. Provisional data is plotted on dashed line.</p>
            </ol>
        }, {
            id: "2",
            header: "Why is no data showing up on my plots?",
            content: <p>If there is no data, please refer <a href='https://clearlakerehabilitation.ucdavis.edu/metadata'>here</a> to read more about the metadata. If you are loading more than one year's worth of data, expect low browser performance, as there are lots of data points to graph.</p>
        }
    ];

    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>

            <div className="collapsible-container">
                <CollapsibleItem header={content[0].header} content={content[0].content}/>
                <CollapsibleItem header={content[1].header} content={content[1].content}/>
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

            <Chart 
                chartProps={chartProps}
                isLoading={isLoading}
                isEmpty={isEmpty}
             />
        </div>
        
    )
}