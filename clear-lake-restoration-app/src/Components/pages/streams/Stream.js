import React, { createElement, useEffect, useState } from 'react';
import StreamChart from './StreamChart';
import Highcharts from 'highcharts';
import useFetch from 'react-fetch-hook'

import DateRangePicker from '../../DateRangePicker';
import DataDisclaimer from '../../DataDisclaimer';

import { convertDate } from '../../utils';

import "./Stream.css";

  // get data based on graph type
  function getFilteredData(data, dataType) {
    let m = [];
    //console.log(data)
    //console.log("datatype:",dataType)
    if (dataType == "Flow") {
        //var data = cleanTurbMeanData(data,dataType)
        //console.log("flow data")
        data.forEach((element => {
            //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
    
            m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element[dataType])]);
        }));
    }
    else if (dataType == "Rain") {
        data.forEach((element => {
            //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
    
            m.push([new Date(element.DateTime_PST).getTime(), parseFloat(element[dataType])]);
        }));
    }
    else {
        data.forEach((element => {
        //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
        //let temp = parseFloat(element[dataType]);
        const fToCel= temp => Math.round( (temp *1.8 )+32 );

        m.push([new Date(element.TmStamp).getTime(), fToCel(parseFloat(element[dataType]))]);

        //m.push([new Date(element.TmStamp).getTime(), parseFloat(element[dataType])]);
    }));
}
   // console.log(m)
    return m.reverse();
}

export default function Stream(props) {
    const [chartProps,setChartProps] = useState({

        chart: {
            zoomType: 'x',
            height: (9 / 16 * 100) + '%' // 16:9 ratio
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
        xAxis: {
            type: 'datetime'
        },
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
            height: '33.3%',
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
            height: '33.3%',
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
            height: '33.3%',
            top: '33.3%',
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
            height: '33.3%',
            top: '66.6%',
            offset: 0
        }],
        tooltip: {
            formatter: function () {
                // The first returned item is the header, subsequent items are the
                // points
                const DayOfMonth = new Date(this.x).getDate();
                const Month = new Date(this.x).getMonth(); // Be careful! January is 0, not 1
                const Year = new Date(this.x).getFullYear();
                const TimeHrs = new Date(this.x).getHours();
                const TimeMins = new Date(this.x).getMinutes();
                const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + TimeHrs + ":" + TimeMins;
                return [dateString].concat(
                    this.points ?
                        this.points.map(function (point) {
                            return point.series.name + ': ' + point.y;
                        }) : []
                );
            },
            split: true
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
    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
    }
    var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
    var search_params = url.searchParams;
    search_params.set('id',props.id);
    search_params.set('rptdate',convertDate(startGraphDate));
    search_params.set('rptend',convertDate(endGraphDate));
    url.search = search_params.toString();
    var new_url = url.toString();
    const creekData = useFetch(new_url);

    var flowurl = new URL('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams')
    var search_params_flow = flowurl.searchParams;
    search_params_flow.set('id',props.id);
    search_params_flow.set('start',convertDate(startGraphDate));
    search_params_flow.set('end',convertDate(endGraphDate));
    flowurl.search = search_params_flow.toString();
   // console.log(flowurl)
    var flow_new_url = flowurl.toString();
    //console.log(flow_new_url)
    const flowData = useFetch(flow_new_url);

    var rainURL = new URL('https://ts09zwptz4.execute-api.us-west-2.amazonaws.com/default/clearlake-precipitation-api')
    var search_params_rain = rainURL.searchParams;
    search_params_rain.set('id',props.id);
    search_params_rain.set('start',convertDate(startGraphDate));
    search_params_rain.set('end',convertDate(endGraphDate));
    rainURL.search = search_params_rain.toString();

    var rain_new_url = rainURL.toString();
   // console.log(rain_new_url)
    
    const rainData = useFetch(rain_new_url);

    useEffect(()=> {
        console.log("use effect for turb temp")
        console.log("creek data loading: ",creekData.isLoading)
        if (!creekData.isLoading && !flowData.isLoading && !rainData.isLoading) {
            let turbtempfiltereddata = getFilteredData(creekData.data, "Turb_Temp")
            let turbfiltereddata = getFilteredData(creekData.data, "Turb_BES")
            let flowfiltereddata = getFilteredData(flowData.data, "Flow")
            let rainfiltereddata = getFilteredData(rainData.data, "Rain")
            setChartProps({...chartProps,
                series: [
                    {
                        data: turbfiltereddata
                    },
                    {
                        data: flowfiltereddata
                    },
                    {
                        data: turbtempfiltereddata
                    },
                    {
                        data: rainfiltereddata
                    }
                ]
            })
        }
    },[startGraphDate,endGraphDate,creekData.isLoading,flowData.isLoading,rainData.isLoading])

    return (
        <div className="stream-container">
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>
            <div className='data-desc-container'>
                <p className='data-desc'>Select start and end dates (maximum 180 day period). <br/>
                    Click submit to update the graphs below.<br/>
                    Allow some time for the data to be fetched. The longer the selected time period, the longer it will take to load.<br/>
                    Use the hamburger icon on the top right of each graph to download the data displayed in the graph.<br/>
                    Click and drag in the plot area to zoom in.<br/>
                    If there is no data, the sensors might not be submerged in the water. Check <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a> for more information. <br />
                    Flow data is from the California Nevada River Forecast Center.
                </p>
            </div>
            <DateRangePicker 
                startDate={startDate} 
                endDate={endDate} 
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                setGraphDates={setGraphDates} 
                maxDays={180}/>
            
            <StreamChart 
                chartProps={chartProps}
                isLoading={creekData.isLoading}
             />

        </div>
    )
}