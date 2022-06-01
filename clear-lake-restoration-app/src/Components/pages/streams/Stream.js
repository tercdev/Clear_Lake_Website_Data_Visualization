import React, { useEffect, useState } from 'react';
import Chart from '../../Chart';
import Highcharts from 'highcharts';

import DateRangePicker from '../../DateRangePicker';
import DataDisclaimer from '../../DataDisclaimer';
import CollapsibleItem from '../../CollapsibleItem';

import { convertDate, convertGMTtoPSTTime, removePast,dateToDateTime } from '../../utils';
import useFetch from 'use-http';

import "./Stream.css";

/**
 * Component for showing one site's stream page.
 * @param {String} id used in API call for a specific site
 * @param {String} name Title of the page
 * @returns {JSX.Element}
 */
export default function Stream(props) {
    // fahrenheit by default
    const [unit, setUnit] = useState('f'); 
    const [graphUnit, setGraphUnit] = useState('f');

    const [realTimeData,setRealTimeData] = useState([]);
    const [cleanData,setCleanData] = useState([]);
    const [flowData,setFlowData] = useState([]);
    const [rainData,setRainData] = useState([]);

    /**
     * set to fahrenheit
     */
    function handleF() {
        setUnit('f');
    }

    /**
     * set to celcius
     */
    function handleC() {
        setUnit('c');
    }
   
    /**
     * Given a data array, return an array of [time, y] to be used for graphing
     * @param {Array} data 
     * @param {String} dataType "Turb_Temp", "Turb_BES", "Temp", "Turb", "Flow", "Rain"
     * @returns {Array} Array of arrays for graphing
     */
    function getFilteredData(data, dataType) {
        let m = [];
        if (dataType === "Temp" || dataType === "Turb_Temp") {
            data.forEach((element => {
                /**
                 * convert celcius to fahrenheit
                 * @param {number} temp temperature in celcius
                 * @returns {number} temperature in fahrenheit
                 */
                const celToF = temp => Math.round((temp * 1.8) + 32);
                if (element.hasOwnProperty('TmStamp')) {
                    let newDate = dateToDateTime(element.TmStamp)
                    let pstTime = convertGMTtoPSTTime(newDate);
                    if (graphUnit === 'f') {
                        m.push([pstTime.getTime(), celToF(parseFloat(element[dataType]))]);
                    } else {
                        m.push([pstTime.getTime(), parseFloat(element[dataType])]);
                    }
                } else {
                    let newDate = dateToDateTime(element.DateTime_UTC)
                    let pstTime = convertGMTtoPSTTime(newDate);

                    if (graphUnit === 'f') {
                        m.push([pstTime.getTime(), celToF(parseFloat(element[dataType]))]);
                    } else {
                        m.push([pstTime.getTime(), parseFloat(element[dataType])]);
                    } 
                }
            }));
        } else {
            data.forEach((element => {
                if (element.hasOwnProperty('TmStamp')) {
                    // let split = element.TmStamp.split(/[^0-9]/);
                    // let newDate = new Date(...split);
                    let newDate = dateToDateTime(element.TmStamp)
                    let pstTime = convertGMTtoPSTTime(newDate);
                    m.push([pstTime.getTime(), parseFloat(element[dataType])]);
                } 
                else if (element.hasOwnProperty('DateTime_UTC')) {
                    let newDate = dateToDateTime(element.DateTime_UTC)
                    let pstTime = convertGMTtoPSTTime(newDate);
                    m.push([pstTime.getTime(), parseFloat(element[dataType])]);
                } 
                else if (element.hasOwnProperty('DateTime_PST')) {
                    let newDate = dateToDateTime(element.DateTime_PST)
                    m.push([newDate.getTime(), parseFloat(element[dataType])]);
                }
            }));
        }
        // sort by date
        m.sort(function(a,b) {
            return (a[0]-b[0]);
        })
        return m.reverse();
    }

    /**
     * Initial state of all the chart properties
     */
    const [chartProps,setChartProps] = useState({
        chart: {
            zoomType: 'x',
            height: 1200,
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
        xAxis: [{ // for the bottom chart
            type: 'datetime',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, { // for the middle chart
            type: 'datetime',
            top: '-70%',
            offset: 0,
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, { // for the top chart
            type: 'datetime',
            top: '-35%',
            offset: 0,
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }],
        yAxis: 
        [{ // for the top chart
            title: {
                text: 'Turbidity [NTU]',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} NTU',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            opposite: true, // on the right side
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
            height: '30%',
            offset: 0
        }, { // for the top chart
            title: {
                text: 'Flow [cfs]',
                style: {
                    color: Highcharts.getOptions().colors[0],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} cfs',
                style: {
                    color: Highcharts.getOptions().colors[0],
                    fontSize: '1rem'
                }
            },
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            height: '30%',
            offset: 0
        }, { // for the middle chart
            title: {
                text: 'Water Temperature [°F]',
                style: {
                    color: Highcharts.getOptions().colors[7],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} °F',
                style: {
                    color: Highcharts.getOptions().colors[7],
                    fontSize: '1rem'
                }
            },
            lineColor: Highcharts.getOptions().colors[7],
            lineWidth: 5,
            height: '30%',
            top: '35%',
            offset: 0,
            max: 100 // max water temperature
        }, { // for the bottom chart
            title: {
                text: 'Precipitation [in]',
                style: {
                    color: Highcharts.getOptions().colors[5],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} in',
                style: {
                    color: Highcharts.getOptions().colors[5],
                    fontSize: '1rem'
                }
            },
            height: '30%',
            top: '70%',
            offset: 0,
            reversed: true
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
                    "Turbidity": 'FTU',
                    "Flow": 'cfs',
                    "Water Temperature in °F": '°F',
                    "Water Temperature in °C": '°C',
                    "Precipitation": 'in'
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
                name: 'Turbidity',
                data: [],
                selected: true,
                yAxis: 0,
                color: Highcharts.getOptions().colors[3],
            }, {
                name: 'Flow',
                data: [],
                selected: true,
                yAxis: 1,
                color: Highcharts.getOptions().colors[0],
            }, {
                name: 'Water Temperature',
                data: [],
                selected: true,
                yAxis: 2,
                color: Highcharts.getOptions().colors[7]
            }, {
                name: 'Precipitation',
                data: [],
                selected: true,
                yAxis: 3,
                color: Highcharts.getOptions().colors[5],
                type: 'column',
                // pointWidth: 5
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
        }
    });

    // set start date as a week ago and end date as today
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);

    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    
    const [isLoading, setIsLoading] = useState(true);

    /**
     * set start date
     * @param {Date} e 
     */
    function handleStartDateChange(e) {
        setStartDate(e);
    }
    
    /**
     * set end date
     * @param {Date} e 
     */
    function handleEndDateChange(e) {
        setEndDate(e);
    }
    
    /**
     * set unit, start date, end date for the chart
     */
    function setGraphDates() {
        setGraphUnit(unit);
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
    }

    const creekRealTime = useFetch('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
    // real-time data Endpoint URL 
    // var url = new URL();
    // var search_params = url.searchParams;
    // search_params.set('id',props.id);
    // let oldestDate = new Date(new Date().setDate(endGraphDate.getDate() - 150));
    // if (startGraphDate < oldestDate) {
    //     search_params.set('rptdate', convertDate(oldestDate));
    // } else {
    //     search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
    // }
    // search_params.set('rptend',convertDate(endGraphDate));
    // url.search = search_params.toString();
    // var new_url = url.toString();
    // const creekData = useFetch(new_url);

    // clean data Endpoint URL (includes turb and temp)
    // var cleanurl = new URL('https://1j27qzg916.execute-api.us-west-2.amazonaws.com/default/clearlake-streamturb-api');
    // var search_params_clean = cleanurl.searchParams;
    // search_params_clean.set('id',props.id);
    // search_params_clean.set('start',convertDate(startGraphDate));
    // search_params_clean.set('end',convertDate(endGraphDate));
    // cleanurl.search = search_params_clean.toString();
    const creekClean = useFetch('https://1j27qzg916.execute-api.us-west-2.amazonaws.com/default/clearlake-streamturb-api');

    // flow data Endpoint URL
    // var flowurl = new URL('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams')
    // var search_params_flow = flowurl.searchParams;
    // search_params_flow.set('id',props.id);
    // search_params_flow.set('start',convertDate(startGraphDate));
    // search_params_flow.set('end',convertDate(endGraphDate));
    // flowurl.search = search_params_flow.toString();
    // var flow_new_url = flowurl.toString();
    const creekFlow = useFetch('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams');

    // rain data Endpoint URL
    // var rainURL = new URL('https://ts09zwptz4.execute-api.us-west-2.amazonaws.com/default/clearlake-precipitation-api')
    // var search_params_rain = rainURL.searchParams;
    // search_params_rain.set('id',props.id);
    // search_params_rain.set('start',convertDate(startGraphDate));
    // search_params_rain.set('end',convertDate(endGraphDate));
    // rainURL.search = search_params_rain.toString();
    // var rain_new_url = rainURL.toString();
    const creekRain = useFetch('https://ts09zwptz4.execute-api.us-west-2.amazonaws.com/default/clearlake-precipitation-api');
    useEffect(()=> {
        setRealTimeData([]);
        setCleanData([]);
        setFlowData([]);
        setRainData([]);

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime();
        let diffDay = diffTime/(1000*3600*24);

        let realTimeDataFetch = [];
        let cleanDataFetch = [];
        let flowDataFetch =[];
        let rainDataFetch = [];

        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 150) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            diffTime = endGraphDate.getTime() - newDay.getTime();
            diffDay = diffTime/(1000*3600*24);

            realTimeDataFetch.push(creekRealTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(newDay)}`));
            cleanDataFetch.push(creekClean.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));

            flowDataFetch.push(creekFlow.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));
            rainDataFetch.push(creekRain.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 151));
            compareDate = newDayPlusOne
;
        }
        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        realTimeDataFetch.push(creekRealTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(endDayPlusOne)}`));
        cleanDataFetch.push(creekClean.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`));

        flowDataFetch.push(creekFlow.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`));
        rainDataFetch.push(creekRain.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`));
        setIsLoading(false); // Loading is true

        realTimeDataFetch.reverse();
        setIsLoading(true); // Loading is true
        async function fetchData() {
            realTimeDataFetch = await Promise.all(realTimeDataFetch);
            cleanDataFetch = await Promise.all(cleanDataFetch);
            flowDataFetch = await Promise.all(flowDataFetch);
            rainDataFetch = await Promise.all(rainDataFetch);

            console.log("realtime",realTimeDataFetch);
            console.log("clean data",cleanDataFetch);
            console.log("flow data",flowDataFetch);
            console.log("rain data",rainDataFetch);

            setRealTimeData(realTimeDataFetch);
            setCleanData(cleanDataFetch);
            setFlowData(flowDataFetch);
            setRainData(rainDataFetch);
            setIsLoading(false);
        }
        fetchData();

    },[startGraphDate,endGraphDate] )

    useEffect(()=> {
        console.log("use effect for turb temp");
        if (!isLoading) {
            console.log("done loading...");
            console.log("realtimedata",realTimeData);
            console.log("cleandata",cleanData);
            console.log("flowedata",flowData);
            console.log("raindata",rainData);
            let creekRealTimeData = [].concat.apply([],realTimeData);
            let creekCleanData = [].concat.apply([],cleanData);
            let creekFlowData = [].concat.apply([],flowData);
            let creekRainData = [].concat.apply([],rainData);

            let turbtempfiltereddata = getFilteredData(creekRealTimeData, "Turb_Temp");
            let turbfiltereddata = getFilteredData(creekRealTimeData, "Turb_BES");
            let cleanturbtempfiltereddata = getFilteredData(creekCleanData, "Temp");
            let cleanturbfiltereddata = getFilteredData(creekCleanData, "Turb");

            if (cleanturbfiltereddata.length !== 0 && turbfiltereddata.length !== 0) {
                var lastdate = cleanturbfiltereddata[0][0];
                let dataLastDate = new Date(cleanturbfiltereddata[0][0]);
                let realDataLastDate = new Date(turbfiltereddata[0][0]);

                if (dataLastDate.getFullYear() === realDataLastDate.getFullYear() && 
                    dataLastDate.getMonth() === realDataLastDate.getMonth() && 
                    dataLastDate.getDay() === realDataLastDate.getDay()) {
                    // don't need to use real time data
                    turbfiltereddata = [];
                    turbtempfiltereddata = [];
                    lastdate = undefined;
                }
                // remove all the data before lastdate
                turbfiltereddata = removePast(turbfiltereddata, lastdate);
                turbtempfiltereddata = removePast(turbtempfiltereddata, lastdate);
            }
            let flowfiltereddata = getFilteredData(creekFlowData, "Flow");
            let rainfiltereddata = getFilteredData(creekRainData, "Rain");

            /**
             * define where the dashed line starts  
             * https://api.highcharts.com/highcharts/plotOptions.series.zones.dashStyle
             */
            let zoneProps = [];
            if (lastdate === undefined && turbfiltereddata.length !== 0) {
                zoneProps = [{value: turbfiltereddata[0][0]},{dashStyle: 'dash'}];
            } else {
                zoneProps = [{value: lastdate},{dashStyle: 'dash'}];
            }

            /**
             * oldest time
             */
            let minX = flowfiltereddata[flowfiltereddata.length-1][0];
            /**
             * latest time
             */
            let maxX = flowfiltereddata[0][0];
            
            // sort by date
            let combinedturb = cleanturbfiltereddata.concat(turbfiltereddata);
            combinedturb.sort(function(a,b) {
                return (a[0]-b[0]);
            });
            let combinedturbtemp = cleanturbtempfiltereddata.concat(turbtempfiltereddata);
            combinedturbtemp.sort(function(a,b) {
                return (a[0]-b[0]);
            });
            flowfiltereddata.sort(function(a,b) {
                return (a[0]-b[0]);
            });
            rainfiltereddata.sort(function(a,b) {
                return (a[0]-b[0]);
            });

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
            // set the variables depending on fahrenheit or celcius option 
            if (graphUnit === 'f') {
                ylabel = 'Water Temperature [°F]';
                yformat = '{value} °F';
                yseries = 'Water Temperature in °F';
            } else {
                ylabel = 'Water Temperature [°C]';
                yformat = '{value} °C';
                yseries = 'Water Temperature in °C';
            }
            
            // update chart properties with data
            setChartProps({...chartProps,
                series: [
                    {
                        data: combinedturb,
                        zoneAxis: 'x',
                        zones: zoneProps
                    },
                    {
                        data: flowfiltereddata
                    },
                    {
                        data: combinedturbtemp,
                        zoneAxis: 'x',
                        zones: zoneProps,
                        name: yseries
                    },
                    {
                        data: rainfiltereddata
                    }
                ],
                xAxis: [{
                    min: minX, max: maxX,
                }, {
                    min: minX, max: maxX
                },{
                    min: minX, max: maxX
                }],
                yAxis: [{},{},{title: {
                    text: ylabel,
                    style: {
                        color: Highcharts.getOptions().colors[7]
                    }
                },
                labels: {
                    format: yformat,
                    style: {
                        color: Highcharts.getOptions().colors[7]
                    }
                },},{}]
            });
        }
    },[isLoading,graphUnit])

    // for the collapsible FAQ
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
            content: <p>If there is no data, the sensors might not be submerged in the water. Check <a href='https://clearlakerestoration.sf.ucdavis.edu/metadata'>here</a> to read more about the metadata.</p>
        }, {
            id: "3",
            header: "Where is the data collected?",
            content: <p>Stream turbidity and temperature are measured by UC Davis sensors that are co-located with existing California Department of Water Resources gauging stations. However, river flow data and precipitation data are externally scraped from <a href="https://cdec.water.ca.gov/">California Department of Water Resources</a>.</p>
        }
    ];

    return (
        <div className="stream-container">
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>

            <div className="collapsible-container">
                <CollapsibleItem header={content[0].header} content={content[0].content}/>
                <CollapsibleItem header={content[1].header} content={content[1].content}/>
                <CollapsibleItem header={content[2].header} content={content[2].content}/>
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
             />
        </div>
    )
}