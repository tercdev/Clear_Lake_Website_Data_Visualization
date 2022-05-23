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
        removePast
     } from '../../utils.js';

export default function Met(props) {
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
        console.log("dataType",dataType,data)
        data.forEach((element => {
            // console.log(element)
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
        // console.log(dataType,m)
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
        boost: {
            useGPUTranslations: true
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
                boostThreshold: 10000
            },
            {
                name: 'Relative Humidity',
                data: [],
                selected: true,
                yAxis: 1,
                color: Highcharts.getOptions().colors[0],
                boostThreshold: 10000
            },
            {
                name: 'Atmospheric Pressure',
                data: [],
                selected: true,
                yAxis: 2,
                color: Highcharts.getOptions().colors[4],
                boostThreshold: 10000
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
                            "radius": 5
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
                boostThreshold: 10000
            },     
            {
                name: 'Solar Radiation',
                data: [],
                selected: true,
                yAxis: 5,
                color: Highcharts.getOptions().colors[6],
                boostThreshold: 10000
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
    
    function handleStartDateChange(e) {
        setStartDate(e);
    }
    
    function handleEndDateChange(e) {
        setEndDate(e);
    }
   
    function setGraphDates() {
        setGraphUnit(unit);
        console.log("set graph unit", unit)
        setError(false);
        // let latestDate = new Date(new Date(startDate).setDate(365));
        setGraphStartDate(startDate);
        // if (endDate > latestDate) {
        //     setError(true);
        //     setEndDate(latestDate);
        //     setGraphEndDate(latestDate);
        // } else {
            setGraphEndDate(endDate);
        // }
    }

    // real-time data Endpoint URL 
    // var real_time_url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
    // let real_search_params = real_time_url.searchParams;
    // real_search_params.set('id',props.id);
    // let oldestDate = new Date(new Date().setDate(endGraphDate.getDate() - 150));
    // if (startGraphDate < oldestDate) {
    //     console.log("oldest date")
    //     real_search_params.set('rptdate', convertDate(oldestDate));
    // } else {
    //     console.log("startgraph end")
    //     real_search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
    // }
    // real_search_params.set('rptend', convertDate(endGraphDate));
    // real_time_url.search = real_search_params.toString();
    // const realTimeData = useFetch(real_time_url.toString());
  
    // // clean data Endpoint URL
    // var clean_data_url = new URL('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');
    // var search_params = clean_data_url.searchParams;
    // search_params.set('id',props.id);
    // search_params.set('start',convertDate(startGraphDate));
    // search_params.set('end',convertDate(endGraphDate));
    // clean_data_url.search = search_params.toString();
    // const cleanMetData = useFetch(clean_data_url.toString());

    const realTimeData = useFetch('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink')
    const cleanMetData = useFetch('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met')

    console.log("loading before: ",realTimeData.loading)
    useEffect(async ()=> {
        console.log(startGraphDate,endGraphDate)
        let diffTime = endGraphDate.getTime() -startGraphDate.getTime()
        let diffDay = diffTime/(1000*3600*24)
        let v =1;
        let fetchlist =[]
        let newDay =0;
        console.log(diffDay)
        let compareDate = startGraphDate;
        while (diffDay > 150) {
            console.log(startGraphDate.getTime())
            // newDay = new Date();
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 150));

            // newDay.setDate(startGraphDate.getDate() + (180));
            console.log("newDay",newDay)
            diffTime = endGraphDate.getTime() - newDay.getTime()
            diffDay = diffTime/(1000*3600*24)
            console.log(diffDay)
            console.log(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(newDay)}`)
            fetchlist.push(realTimeData.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(newDay)}`))
            compareDate = newDay


        }
        fetchlist.push(realTimeData.get(`?id=${props.id}&rptdate=${convertDate(compareDate)}&rptend=${convertDate(endGraphDate)}`))
        console.log("loading initiliazing array: ",realTimeData.loading)
        // let fetchlist = [get(`?id=${v}&rptdate=20220310&rptend=20220516`),
        // get(`?id=${v}&rptdate=20220110&rptend=20220316`)]
        console.log(fetchlist)
        console.log("loading before all: ",realTimeData.loading)
        let promise_arr = await Promise.all(
            fetchlist
            )
        
        console.log(promise_arr)
            let promise = [].concat.apply([],promise_arr)
        console.log("loading after",realTimeData.loading)

        if (!realTimeData.loading) {
            console.log(promise)
            let realTimeRelHumidityData = getFilteredData(promise,"Rel_Humidity");
            let realTimeAirTempData = getFilteredData(promise,"Air_Temp");
            let realTimeAtmPresData = getFilteredData(promise, "Atm_Pres"); // start from lastdate
            let realTimeWindSpeedData = getFilteredData(promise,"Wind_Speed");
            let realTimeWindDirData = getFilteredData(promise,"Wind_Dir");            
            let realTimeSolarRadData = getFilteredData(promise, "Solar_Rad"); // start from lastdate

            let ylabel = ''
            let yformat = ''
            let yseries = ''
            let maxTemp = 0;

            if (graphUnit == 'f') {
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
console.log('setting chart props')
console.log(realTimeAirTempData)
            setChartProps({...chartProps,
                series: [
                {
                    data: realTimeAirTempData,
                    zoneAxis: 'x',
                    // zones: zoneProps,
                    name: yseries
                }, 
                {
                    data: realTimeRelHumidityData,
                    zoneAxis: 'x',
                    // zones: zoneProps
                },
                {
                    data: realTimeAtmPresData,
                    zoneAxis: 'x',
                    // zones: zoneProps
                },
                {
                    data: realTimeWindDirData,
                    zoneAxis: 'x',
                    // zones: zoneProps
                },
                {
                    data: realTimeWindSpeedData,
                    zoneAxis: 'x',
                    // zones: zoneProps
                },
                {
                    data: realTimeSolarRadData,
                    zoneAxis: 'x',
                    // zones: zoneProps
                },
                ],
                // xAxis: [{
                //     min: minX, max: maxX,
                // },{
                //     min: minX, max: maxX,
                // },{
                //     min: minX, max: maxX,
                // },{
                //     min: minX, max: maxX,
                // }],
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
                    // min: 0,
                    // max: 100
                }, {}, {}, {}, {}]
            })
        }
    },[startGraphDate,endGraphDate])

    // useEffect(()=> {
    //     console.log("useffect",realTimeData.loading)
    //     if (!realTimeData.loading) {
    //         console.log(realTimeData.data)
    //         let realTimeRelHumidityData = getFilteredData(realTimeData.data,"Rel_Humidity");
    //         let realTimeAirTempData = getFilteredData(realTimeData.data,"Air_Temp");
    //         let realTimeAtmPresData = getFilteredData(realTimeData.data, "Atm_Pres"); // start from lastdate
    //         let realTimeWindSpeedData = getFilteredData(realTimeData.data,"Wind_Speed");
    //         let realTimeWindDirData = getFilteredData(realTimeData.data,"Wind_Dir");            
    //         let realTimeSolarRadData = getFilteredData(realTimeData.data, "Solar_Rad"); // start from lastdate

    //         let ylabel = ''
    //         let yformat = ''
    //         let yseries = ''
    //         let maxTemp = 0;

    //         if (graphUnit == 'f') {
    //             ylabel = 'Air Temperature [°F]'
    //             yformat = '{value} °F'
    //             yseries = 'Air Temperature in °F';
    //             maxTemp = 120;
    //         } else {
    //             ylabel = 'Air Temperature [°C]'
    //             yformat = '{value} °C'
    //             yseries = 'Air Temperature in °C'
    //             maxTemp = 40;
    //         }

    //         setChartProps({...chartProps,
    //             series: [
    //             {
    //                 data: realTimeAirTempData,
    //                 zoneAxis: 'x',
    //                 // zones: zoneProps,
    //                 name: yseries
    //             }, 
    //             {
    //                 data: realTimeRelHumidityData,
    //                 zoneAxis: 'x',
    //                 // zones: zoneProps
    //             },
    //             {
    //                 data: realTimeAtmPresData,
    //                 zoneAxis: 'x',
    //                 // zones: zoneProps
    //             },
    //             {
    //                 data: realTimeWindDirData,
    //                 zoneAxis: 'x',
    //                 // zones: zoneProps
    //             },
    //             {
    //                 data: realTimeWindSpeedData,
    //                 zoneAxis: 'x',
    //                 // zones: zoneProps
    //             },
    //             {
    //                 data: realTimeSolarRadData,
    //                 zoneAxis: 'x',
    //                 // zones: zoneProps
    //             },
    //             ],
    //             // xAxis: [{
    //             //     min: minX, max: maxX,
    //             // },{
    //             //     min: minX, max: maxX,
    //             // },{
    //             //     min: minX, max: maxX,
    //             // },{
    //             //     min: minX, max: maxX,
    //             // }],
    //             yAxis: [{
    //                 title: {
    //                     text: ylabel,
    //                     style: {
    //                         color: Highcharts.getOptions().colors[3]
    //                     }
    //                 },
    //                 labels: {
    //                     format: yformat,
    //                     style: {
    //                         color: Highcharts.getOptions().colors[3]
    //                     }
    //                 },
    //                 max: maxTemp
    //             }, {
    //                 // min: 0,
    //                 // max: 100
    //             }, {}, {}, {}, {}]
    //         })
    //     }
    // },[realTimeData.loading])

    // useEffect(()=> {
        // if (!cleanMetData.loading && !realTimeData.loading) {
        //     if (cleanMetData.data.length != 0 || realTimeData.data.length != 0) {
        //         let relHumidityData = getFilteredData(cleanMetData.data,"Rel_Humidity");
        //         let airTempData = getFilteredData(cleanMetData.data,"Air_Temp");
        //         let atmPresData = getFilteredData(cleanMetData.data,"Atm_Pres");
        //         let windSpeedData = getFilteredData(cleanMetData.data,"Wind_Speed");
        //         let windDirData = getFilteredData(cleanMetData.data,"Wind_Dir");
        //         let solarRadData = getFilteredData(cleanMetData.data,"Solar_Rad");

                // let realTimeRelHumidityData = getFilteredData(realTimeData.data,"Rel_Humidity");
                // let realTimeAirTempData = getFilteredData(realTimeData.data,"Air_Temp");
                // let realTimeAtmPresData = getFilteredData(realTimeData.data, "Atm_Pres"); // start from lastdate
                // let realTimeWindSpeedData = getFilteredData(realTimeData.data,"Wind_Speed");
                // let realTimeWindDirData = getFilteredData(realTimeData.data,"Wind_Dir");            
                // let realTimeSolarRadData = getFilteredData(realTimeData.data, "Solar_Rad"); // start from lastdate

        //         if (atmPresData.length != 0 && realTimeAtmPresData.length != 0) {
        //             var lastdate = atmPresData[0][0];
                    
        //             let dataLastDate = new Date(atmPresData[0][0]);
        //             let realDataLastDate = new Date(realTimeAtmPresData[0][0]);
        //             if (dataLastDate.getFullYear() == realDataLastDate.getFullYear() && dataLastDate.getMonth() == realDataLastDate.getMonth() && dataLastDate.getDay() == realDataLastDate.getDay()) {
        //                 realTimeAtmPresData = []
        //                 realTimeRelHumidityData = []
        //                 realTimeAirTempData = []
        //                 realTimeWindSpeedData = []
        //                 realTimeWindDirData = []
        //                 realTimeSolarRadData = []
        //                 lastdate = undefined
        //             }
        //             realTimeAtmPresData = removePast(realTimeAtmPresData, lastdate);
        //             realTimeRelHumidityData = removePast(realTimeRelHumidityData, lastdate);
        //             realTimeAirTempData = removePast(realTimeAirTempData, lastdate);
        //             realTimeWindSpeedData = removePast(realTimeWindSpeedData, lastdate);
        //             realTimeWindDirData = removePast(realTimeWindDirData, lastdate);
        //             realTimeSolarRadData = removePast(realTimeSolarRadData, lastdate);
        //         }
                
        //         let combinedAtmPresData = atmPresData.concat(realTimeAtmPresData);
        //         combinedAtmPresData.sort(function(a,b) {
        //             return (a[0]-b[0])
        //         })
        //         let combinedRelHumidityData = relHumidityData.concat(realTimeRelHumidityData);
        //         combinedRelHumidityData.sort(function(a,b) {
        //             return (a[0]-b[0])
        //         })
        //         let combinedAirTempData = airTempData.concat(realTimeAirTempData);
        //         combinedAirTempData.sort(function(a,b) {
        //             return (a[0]-b[0])
        //         })
        //         let combinedWindSpeedData = windSpeedData.concat(realTimeWindSpeedData);
        //         combinedWindSpeedData.sort(function(a,b) {
        //             return (a[0]-b[0])
        //         })
        //         let combinedWindDirData = windDirData.concat(realTimeWindDirData);
        //         combinedWindDirData.sort(function(a,b) {
        //             return (a[0]-b[0])
        //         })
        //         let combinedSolarRadData = solarRadData.concat(realTimeSolarRadData);
        //         combinedSolarRadData.sort(function(a,b) {
        //             return (a[0]-b[0])
        //         })
        //         let zoneProps = [];
        //         if (lastdate == undefined && realTimeAtmPresData.length != 0) {
        //             zoneProps = [{value: realTimeAtmPresData[0][0]},{dashStyle: 'dash'}]
        //         } else {
        //             zoneProps = [{value: lastdate}, {dashStyle: 'dash'}]
        //         }
        //         let maxX = combinedAtmPresData[combinedAtmPresData.length-1][0];
        //         let minX = combinedAtmPresData[0][0];
                // let ylabel = ''
                // let yformat = ''
                // let yseries = ''
                // let maxTemp = 0;
                // if (graphUnit == 'f') {
                //     ylabel = 'Air Temperature [°F]'
                //     yformat = '{value} °F'
                //     yseries = 'Air Temperature in °F';
                //     maxTemp = 120;
                // } else {
                //     ylabel = 'Air Temperature [°C]'
                //     yformat = '{value} °C'
                //     yseries = 'Air Temperature in °C'
                //     maxTemp = 40;
                // }
                // setChartProps({...chartProps,
                //     series: [
                //     {
                //         data: combinedAirTempData,
                //         zoneAxis: 'x',
                //         zones: zoneProps,
                //         name: yseries
                //     }, 
                //     {
                //         data: combinedRelHumidityData,
                //         zoneAxis: 'x',
                //         zones: zoneProps
                //     },
                //     {
                //         data: combinedAtmPresData,
                //         zoneAxis: 'x',
                //         zones: zoneProps
                //     },
                //     {
                //         data: combinedWindDirData,
                //         zoneAxis: 'x',
                //         zones: zoneProps
                //     },
                //     {
                //         data: combinedWindSpeedData,
                //         zoneAxis: 'x',
                //         zones: zoneProps
                //     },
                //     {
                //         data: combinedSolarRadData,
                //         zoneAxis: 'x',
                //         zones: zoneProps
                //     },
                //     ],
                //     xAxis: [{
                //         min: minX, max: maxX,
                //     },{
                //         min: minX, max: maxX,
                //     },{
                //         min: minX, max: maxX,
                //     },{
                //         min: minX, max: maxX,
                //     }],
                //     yAxis: [{
                //         title: {
                //             text: ylabel,
                //             style: {
                //                 color: Highcharts.getOptions().colors[3]
                //             }
                //         },
                //         labels: {
                //             format: yformat,
                //             style: {
                //                 color: Highcharts.getOptions().colors[3]
                //             }
                //         },
                //         max: maxTemp
                //     }, {
                //         // min: 0,
                //         // max: 100
                //     }, {}, {}, {}, {}]
                // })
        //     }
        // }
    //   },[cleanMetData.loading, realTimeData.loading, startGraphDate, endGraphDate, graphUnit])

    // for the collapsible FAQ
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
                isLoading={realTimeData.loading || cleanMetData.loading}
             />
        </div>
        
    )
}