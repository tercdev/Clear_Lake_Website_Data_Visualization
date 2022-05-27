import React, { useEffect, useState } from 'react';
import Chart from '../../Chart';
import Highcharts from 'highcharts';

import DateRangePicker from '../../DateRangePicker';
import DataDisclaimer from '../../DataDisclaimer';
import CollapsibleItem from '../../CollapsibleItem';

import { convertDate,convertGMTtoPSTTime } from '../../utils';
import useFetch from 'use-http';

import "./Stream.css";

// function convertGMTtoPSTTime (date) {
//     // reference: https://stackoverflow.com/questions/22493924/get-user-time-and-convert-them-to-pst
//     var offset = 420; 
//     var offsetMillis = offset * 60 * 1000;
//     var today = date;
//     var millis = today.getTime();
//     var timeZoneOffset = (today.getTimezoneOffset() * 60 * 1000);

//     var pst = millis - offsetMillis; 
//     return new Date(today.getTime() - timeZoneOffset);
// }

export default function Stream(props) {
    const [unit, setUnit] = useState('f'); 
    const [graphUnit, setGraphUnit] = useState('f');
    const [realTimeData,setRealTimeData] = useState([])
    const [cleanData,setCleanData] = useState([])
    const [flowData,setFlowData] = useState([])
    const [rainData,setRainData] = useState([])

    function handleF(e) {
        console.log(e)
        setUnit('f')
    }
    function handleC(e) {
        setUnit('c')
        console.log("radio to C")
    }
   
    // get data based on graph type
    function getFilteredData(data, dataType) {
        let m = [];
        if (dataType === "Temp" || dataType === "Turb_Temp") {
            data.forEach((element => {
                const fToCel= temp => Math.round( (temp *1.8 )+32 );
                if (element.hasOwnProperty('TmStamp')) {
                    if (graphUnit === 'f') {
                        m.push([new Date(element.TmStamp).getTime(), fToCel(parseFloat(element[dataType]))]);
                    } else {
                        m.push([new Date(element.TmStamp).getTime(), parseFloat(element[dataType])]);
                    }
                } else {
                    if (graphUnit === 'f') {
                        m.push([new Date(element.DateTime_UTC).getTime(), fToCel(parseFloat(element[dataType]))]);
                    } else {
                        m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element[dataType])]);
                    } 
                }
            }));
        } else {
            data.forEach((element => {
                if (element.hasOwnProperty('TmStamp')) {
                    m.push([new Date(element.TmStamp).getTime(), parseFloat(element[dataType])]);
                } else if (element.hasOwnProperty('DateTime_UTC')) {
                    m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element[dataType])]);
                } else if (element.hasOwnProperty('DateTime_PST')) {
                    m.push([new Date(element.DateTime_PST).getTime(), parseFloat(element[dataType])]);
                }
            }))
        }
        m.sort(function(a,b) {
            return (a[0]-b[0])
        })
        return m.reverse()
    }
    const [chartProps,setChartProps] = useState({
        chart: {
            zoomType: 'x',
            height: 1200,
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
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>Clean data plotted on solid line. Provisional data plotted on dashed line.',
            style: {
                fontSize: '1rem'
            }
        },
        xAxis: [{
            type: 'datetime',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, {
            type: 'datetime',
            top: '-70%',
            offset: 0,
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, {
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
        [{ // Primary yAxis
            labels: {
                format: '{value} NTU',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            title: {
                text: 'Turbidity [NTU]',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            opposite: true,
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
            height: '30%',
            offset: 0
           
        }, { // Secondary yAxis
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
            
        }, {
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
            max: 100
        }, {
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
                const DayOfMonth = new Date(this.x).getDate();
                const Month = new Date(this.x).getMonth(); // Be careful! January is 0, not 1
                const Year = new Date(this.x).getFullYear();
                const TimeHrs = new Date(this.x).getHours();
                const TimeMins = new Date(this.x).getMinutes();
                const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + TimeHrs + ":" + (TimeMins<10?'0':'')+TimeMins;
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
            verticalAlign: 'top',
            itemStyle: {
                fontSize: '1rem'
            }
        },
        updateTime: {
            setTime: 0,
            endTime: 0,
        }
    })
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function handleStartDateChange(e) {
        setStartDate(e);
    }
    
    function handleEndDateChange(e) {
        setEndDate(e);
    }
    
    function setGraphDates() {
        setGraphUnit(unit);
        console.log("set graph unit", unit)
        console.log("start date",startDate)
        console.log("end date",endDate)
        setError(false);
        let latestDate = new Date(new Date(startDate).setDate(365));
        setGraphStartDate(startDate);
        // if (endDate > latestDate) {
            // setError(true);
            // setEndDate(latestDate);
            // setGraphEndDate(latestDate);
        // } else {
            setGraphEndDate(endDate);
        // }
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
        setRealTimeData([])
        setCleanData([])
        setFlowData([])
        setRainData([])

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime()
        let diffDay = diffTime/(1000*3600*24)

        let realTimeDataFetch = []
        let cleanDataFetch = []
        let flowDataFetch =[]
        let rainDataFetch = []

        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 150) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            diffTime = endGraphDate.getTime() - newDay.getTime()
            diffDay = diffTime/(1000*3600*24)

            realTimeDataFetch.push(creekRealTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(newDay)}`))
            cleanDataFetch.push(creekClean.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`))

            flowDataFetch.push(creekFlow.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`))
            rainDataFetch.push(creekRain.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`))

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 151));
            compareDate = newDayPlusOne

        }

        realTimeDataFetch.push(creekRealTime.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(endGraphDate)}`))
        cleanDataFetch.push(creekClean.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`))

        flowDataFetch.push(creekFlow.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`))
        rainDataFetch.push(creekRain.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endGraphDate)}`))
        setIsLoading(false); // Loading is true

        realTimeDataFetch.reverse()
        setIsLoading(true); // Loading is true
        async function fetchData() {
            realTimeDataFetch = await Promise.all(realTimeDataFetch)
            cleanDataFetch = await Promise.all(cleanDataFetch)
            flowDataFetch = await Promise.all(flowDataFetch)
            rainDataFetch = await Promise.all(rainDataFetch)

            console.log("realtime",realTimeDataFetch)
            console.log("clean data",cleanDataFetch)
            console.log("flow data",flowDataFetch)
            console.log("rain data",rainDataFetch)

            setRealTimeData(realTimeDataFetch)
            setCleanData(cleanDataFetch)
            setFlowData(flowDataFetch)
            setRainData(rainDataFetch)
            setIsLoading(false)
        }
        fetchData()

    },[startGraphDate,endGraphDate] )

    function removePast(data, date) {
        if (date === undefined) {
            return data;
        }
        let i = 0;
        while (data[i][0] <= date) {
            data.shift();
        }
        return data;
    }

    useEffect(()=> {
        console.log("use effect for turb temp")
        if (!isLoading) {
            console.log("done loading...")
            console.log("realtimedata",realTimeData)
            console.log("cleandata",cleanData)
            console.log("flowedata",flowData)
            console.log("raindata",rainData)
            let creekRealTimeData = [].concat.apply([],realTimeData)
            let creekCleanData = [].concat.apply([],cleanData)
            let creekFlowData = [].concat.apply([],flowData)
            let creekRainData = [].concat.apply([],rainData)

            let turbtempfiltereddata = getFilteredData(creekRealTimeData, "Turb_Temp");
            let turbfiltereddata = getFilteredData(creekRealTimeData, "Turb_BES");
            let cleanturbtempfiltereddata = getFilteredData(creekCleanData, "Temp");
            let cleanturbfiltereddata = getFilteredData(creekCleanData, "Turb");
            if (cleanturbfiltereddata.length !== 0 && turbfiltereddata.length !== 0) {
                console.log(cleanturbfiltereddata)
                var lastdate = cleanturbfiltereddata[0][0];
                console.log(lastdate);
                let dataLastDate = new Date(cleanturbfiltereddata[0][0]);
                let realDataLastDate = new Date(turbfiltereddata[0][0]);
                let realDataFirstDate = new Date(turbfiltereddata[turbfiltereddata.length-1][0]);
                if (dataLastDate.getDay() === realDataLastDate.getDay() || dataLastDate.getDay() === realDataFirstDate.getDay()) {
                    turbfiltereddata = [];
                    turbtempfiltereddata = [];
                    lastdate = undefined;
                }
                turbfiltereddata = removePast(turbfiltereddata, lastdate);
                turbtempfiltereddata = removePast(turbtempfiltereddata, lastdate);
            }
            let flowfiltereddata = getFilteredData(creekFlowData, "Flow");
            let rainfiltereddata = getFilteredData(creekRainData, "Rain");
            let zoneProps = [];
            if (lastdate === undefined && turbfiltereddata.length !== 0) {
                zoneProps = [{value: turbfiltereddata[0][0]},{dashStyle: 'dash'}]
            } else {
                zoneProps = [{value: lastdate},{dashStyle: 'dash'}]
            }
            let minX = flowfiltereddata[flowfiltereddata.length-1][0];
            let maxX = flowfiltereddata[0][0];
            // sort
            let combinedturb = cleanturbfiltereddata.concat(turbfiltereddata);
            combinedturb.sort(function(a,b) {
                return (a[0]-b[0])
            })
            let combinedturbtemp = cleanturbtempfiltereddata.concat(turbtempfiltereddata);
            combinedturbtemp.sort(function(a,b) {
                return (a[0]-b[0])
            })
            flowfiltereddata.sort(function(a,b) {
                return (a[0]-b[0])
            })
            rainfiltereddata.sort(function(a,b) {
                return (a[0]-b[0])
            })
            let ylabel = ''
            let yformat = ''
            let yseries = ''
            if (graphUnit === 'f') {
                ylabel = 'Water Temperature [°F]'
                yformat = '{value} °F'
                yseries = 'Water Temperature in °F'
            } else {
                ylabel = 'Water Temperature [°C]'
                yformat = '{value} °C'
                yseries = 'Water Temperature in °C'
            }
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
            })
        }
    },[isLoading,graphUnit])

    //for the collapsible FAQ
     
    const header1 = "How to use the graphs and see the data below?";
    const content1 = [<ol>
            <li>Select start and end dates with maximum 365-day period</li>
            <li>Click submit to update the graphs below</li>
            <li>Graph and data loading will depend on the length of the selected time period</li>
        </ol>];

    const header2 = "Why is no data showing up on my plots?";
    const content2 = [<p>If there is no data, the sensors might not be submerged in the water. Check <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a> to read more about the metadata.</p>];

    const header3 = "Where is the data collected?";
    const content3 = [<p>Stream turbidity and temperature are measured by UC Davis sensors that are co-located with existing California Department of Water Resources gauging stations. However, river flow data and precipitation data are externally scraped from <a href="https://cdec.water.ca.gov/">California Department of Water Resources</a>.</p>];

    return (
        <div className="stream-container">
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>

            <div className="collapsible-container">
                <CollapsibleItem header={header1} content={content1}/>
                <CollapsibleItem header={header2} content={content2}/>
                <CollapsibleItem header={header3} content={content3}/>
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