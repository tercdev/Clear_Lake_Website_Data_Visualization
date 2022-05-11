import React, { useEffect, useState } from 'react';
import StreamChart from './StreamChart';
import Highcharts from 'highcharts';
import useFetch from 'react-fetch-hook';

import DateRangePicker from '../../DateRangePicker';
import DataDisclaimer from '../../DataDisclaimer';

import { convertDate } from '../../utils';

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
        if (dataType == "Temp" || dataType == "Turb_Temp") {
            data.forEach((element => {
                const fToCel= temp => Math.round( (temp *1.8 )+32 );
                if (element.hasOwnProperty('TmStamp')) {
                    if (graphUnit == 'f') {
                        m.push([new Date(element.TmStamp).getTime(), fToCel(parseFloat(element[dataType]))]);
                    } else {
                        m.push([new Date(element.TmStamp).getTime(), parseFloat(element[dataType])]);
                    }
                } else {
                    if (graphUnit == 'f') {
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
    // console.log(m)
        // return m.reverse();
        return m.reverse()
    }
    const [chartProps,setChartProps] = useState({

        chart: {
            zoomType: 'x',
            // height: (9 / 16 * 120) + '%' // 16:9 ratio
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
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>Clean data plotted on solid line. Provisional data plotted on dashed line.'
        },
        xAxis: [{
            type: 'datetime',
            // crosshair: true
        }, {
            type: 'datetime',
            // opposite: true,
            top: '-70%',
            offset: 0,
        }, {
            type: 'datetime',
            top: '-35%',
            offset: 0,
        }],
        yAxis: 
        [{ // Primary yAxis
            labels: {
                format: '{value} NTU',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            title: {
                text: 'Turbidity [NTU]',
                style: {
                    color: Highcharts.getOptions().colors[3]
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
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} cfs',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            height: '30%',
            offset: 0
            
        }, {
            title: {
                text: 'Temperature [°F]',
                style: {
                    color: Highcharts.getOptions().colors[7]
                }
            },
            labels: {
                format: '{value} °F',
                style: {
                    color: Highcharts.getOptions().colors[7]
                }
            },
            lineColor: Highcharts.getOptions().colors[7],
            lineWidth: 5,
            height: '30%',
            top: '35%',
            offset: 0
        }, {
            title: {
                text: 'Precipitation [in]',
                style: {
                    color: Highcharts.getOptions().colors[5]
                }
            },
            labels: {
                format: '{value} in',
                style: {
                    color: Highcharts.getOptions().colors[5]
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
                    "Temperature in °F": '°F',
                    "Temperature in °C": '°C',
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
                fontSize:'15px'
            }
        },
        series: [
            {
                name: 'Turbidity',
                data: [],
                selected: true,
                yAxis: 0,
                color: Highcharts.getOptions().colors[3],
            }, 
            {
                name: 'Flow',
                data: [],
                selected: true,
                yAxis: 1,
                color: Highcharts.getOptions().colors[0],
            },
            {
                name: 'Temperature',
                data: [],
                selected: true,
                yAxis: 2,
                color: Highcharts.getOptions().colors[7]
            },
            {
                name: 'Precipitation',
                data: [],
                selected: true,
                yAxis: 3,
                color: Highcharts.getOptions().colors[5],
                type: 'column',
                // pointWidth: 5
            },     
        ],
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
    function handleStartDateChange(e) {
        setStartDate(e);
    }
    function handleEndDateChange(e) {
        setEndDate(e);
    }
    const [error, setError] = useState(false);
    function setGraphDates() {
        setGraphUnit(unit);
        console.log("set graph unit", unit)
        setError(false);
        let latestDate = new Date(new Date(startDate).setDate(365));
        setGraphStartDate(startDate);
        if (endDate > latestDate) {
            setError(true);
            setEndDate(latestDate);
            setGraphEndDate(latestDate);
        } else {
            setGraphEndDate(endDate);
        }
    }
    var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
    var search_params = url.searchParams;
    search_params.set('id',props.id);
    let oldestDate = new Date(new Date().setDate(endGraphDate.getDate() - 150));
    if (startGraphDate < oldestDate) {
        search_params.set('rptdate', convertDate(oldestDate));
    } else {
        search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
    }
    search_params.set('rptend',convertDate(endGraphDate));
    url.search = search_params.toString();
    var new_url = url.toString();
    const creekData = useFetch(new_url);

    // clean data Endpoint URL (includes turb and temp)
    var cleanurl = new URL('https://1j27qzg916.execute-api.us-west-2.amazonaws.com/default/clearlake-streamturb-api');
    var search_params_clean = cleanurl.searchParams;
    search_params_clean.set('id',props.id);
    search_params_clean.set('start',convertDate(startGraphDate));
    search_params_clean.set('end',convertDate(endGraphDate));
    cleanurl.search = search_params_clean.toString();
    const cleanData = useFetch(cleanurl.toString());

    // flow data Endpoint URL
    var flowurl = new URL('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams')
    var search_params_flow = flowurl.searchParams;
    search_params_flow.set('id',props.id);
    search_params_flow.set('start',convertDate(startGraphDate));
    search_params_flow.set('end',convertDate(endGraphDate));
    flowurl.search = search_params_flow.toString();
    var flow_new_url = flowurl.toString();
    const flowData = useFetch(flow_new_url);

    // rain data Endpoint URL
    var rainURL = new URL('https://ts09zwptz4.execute-api.us-west-2.amazonaws.com/default/clearlake-precipitation-api')
    var search_params_rain = rainURL.searchParams;
    search_params_rain.set('id',props.id);
    search_params_rain.set('start',convertDate(startGraphDate));
    search_params_rain.set('end',convertDate(endGraphDate));
    rainURL.search = search_params_rain.toString();
    var rain_new_url = rainURL.toString();
    
    const rainData = useFetch(rain_new_url);

    function removePast(data, date) {
        if (date == undefined) {
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
        console.log("creek data loading: ",creekData.isLoading)
        if (!creekData.isLoading && !flowData.isLoading && !rainData.isLoading && !cleanData.isLoading) {
            let turbtempfiltereddata = getFilteredData(creekData.data, "Turb_Temp");
            let turbfiltereddata = getFilteredData(creekData.data, "Turb_BES");
            let cleanturbtempfiltereddata = getFilteredData(cleanData.data, "Temp");
            let cleanturbfiltereddata = getFilteredData(cleanData.data, "Turb");
            if (cleanturbfiltereddata.length != 0 && turbfiltereddata.length != 0) {
                console.log(cleanturbfiltereddata)
                var lastdate = cleanturbfiltereddata[0][0];
                console.log(lastdate);
                let dataLastDate = new Date(cleanturbfiltereddata[0][0]);
                let realDataLastDate = new Date(turbfiltereddata[0][0]);
                let realDataFirstDate = new Date(turbfiltereddata[turbfiltereddata.length-1][0]);
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    turbfiltereddata = [];
                    turbtempfiltereddata = [];
                    lastdate = undefined;
                }
                turbfiltereddata = removePast(turbfiltereddata, lastdate);
                turbtempfiltereddata = removePast(turbtempfiltereddata, lastdate);
            }
            let flowfiltereddata = getFilteredData(flowData.data, "Flow");
            let rainfiltereddata = getFilteredData(rainData.data, "Rain");
            let zoneProps = [];
            if (lastdate == undefined && turbfiltereddata.length != 0) {
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
            if (graphUnit == 'f') {
                ylabel = 'Temperature [°F]'
                yformat = '{value} °F'
                yseries = 'Temperature in °F'
            } else {
                ylabel = 'Temperature [°C]'
                yformat = '{value} °C'
                yseries = 'Temperature in °C'
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
                    // plotLines: [{
                    //     color: '#FF0000',
                    //     width: 5,
                    //     value: lastdate
                    // }]
                },{min: minX, max: maxX},{min: minX, max: maxX}],
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
    },[startGraphDate,endGraphDate,creekData.isLoading,flowData.isLoading,rainData.isLoading,cleanData.isLoading,graphUnit])

    return (
        <div className="stream-container">
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>
            <div className='data-desc-container'>
                <div className='data-col1'>
                    <h3 className="data-header">How to start</h3>
                    <ul>
                        <li>Select start and end dates with maximum 365-day period</li>
                        <li>Click submit to update the graphs below</li>
                        <li>Graph and data loading wiil depend on the length of the selected time period</li>
                    </ul>
                </div>
                <div className='data-col2'>
                    <h3 className="data-header">About the data</h3>
                        <ul>
                            <li>If there is no data, the sensors might not be submerged in the water.</li>
                            <li>Check <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a> to read more about the metadata. </li>
                            <li>Flow data is from the California Nevada River Forecast Center.</li>
                        </ul>
                </div>

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
            <StreamChart 
                chartProps={chartProps}
                isLoading={creekData.isLoading || flowData.isLoading || rainData.isLoading || cleanData.isLoading}
             />
        </div>
    )
}