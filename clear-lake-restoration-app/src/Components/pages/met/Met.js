import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import MetChart from './MetChart.js';
import "react-datepicker/dist/react-datepicker.css";
import DataDisclaimer from '../../DataDisclaimer.js';
import DateRangePicker from '../../DateRangePicker.js';
import useFetch from 'react-fetch-hook'
import { 
        convertDate, 
        convertGMTtoPSTTime,
        cardinalToDeg,
        removePast
     } from '../../utils.js';

function getFilteredData(data, dataType) {
    let m = [];

    data.forEach((element => {
         let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));

        if (dataType == "Wind_Dir") {
            m.push([pstTime.getTime(), cardinalToDeg(element[dataType])]);
        } else {
            m.push([pstTime.getTime(), parseFloat(element[dataType])]);
        }
    }));
    return m.reverse();
}

export default function Met(props) {
    const [airTemp_RelHumChartProps, setAirTemp_RelHumChartProps] = useState({
        chart: {
            zoomType: 'x',
            ignoreHiddenSeries: false,
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
        xAxis: {
            type: 'datetime'
        },
        yAxis: 
        [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            title: {
                text: 'Air Temperature [°C]',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            opposite: true,
            // height: '50%',
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
            // height: '50%',
            // top: '50%',
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            
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
                const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + TimeHrs + ":" + TimeMins + ' PST';
                return [dateString].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (point.series.name  == 'Relative Humidity Clean' || point.series.name == 'Relative Humidity Live') {
                                return point.series.name + ': ' + point.y +'%'
                            }
                            else {
                                return point.series.name + ': ' + point.y +'°C';
                            }
                            
                        }) : []
                );
            },
            split: true
        },

        series: [
            {
                name: 'Air Temperature Clean',
                data: [],
                selected: true,
                yAxis: 0,
                color: Highcharts.getOptions().colors[3],
                
            }, 
            {
                name: 'Air Temperature Live',
                data: [],
                selected: true,
                yAxis: 0,
                color: Highcharts.getOptions().colors[3],
                dashStyle: 'dash',
                
            },
            {
                name: 'Relative Humidity Clean',
                data: [],
                selected: true,
                yAxis: 1,
                color: Highcharts.getOptions().colors[0],
            },
            {
                name: 'Relative Humidity Live',
                data: [],
                selected: true,
                yAxis: 1,
                color: Highcharts.getOptions().colors[0],
                dashStyle: 'dash',
            },
                
        ],
        updateTime: {
            setTime: 0,
            endTime: 0,
        },
    });
    const[ atmPressureChartProps,setAtmPressureChartProps] = useState({
        chart: {
            zoomType: 'x',
            events: {
                load() {
                    this.showLoading();
                }
            }
        },
        time: {
            useUTC: false
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
          },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
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
        },
    
        series: [
            {
                name: 'Atmospheric Pressure Clean',
                data: [],
                selected: true,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'Atmospheric Pressure Live',
                data: [],
                selected: true,
                dashStyle: 'dash',
                color: Highcharts.getOptions().colors[4]
            }
        ],
        tooltip: {
            headerFormat: '<b>{series.name} {point.y} kPA</b><br>',
            pointFormat: '{point.x:%m/%d/%y %H:%M:%S} PST'
        },
        updateTime: {
            setTime: 0,
            endTime: 0,
        }
    })
    const [windSpeedDirChart,setWindSpeedDirChart] = useState({
                chart: {
                    zoomType: 'x',
                    events: {
                        load() {
                            this.showLoading();
                        }
                    }
                },
                time : {
                    useUTC: false
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                   // offset: 40
                },
                yAxis: 
                [{ 
                    title: {
                        text: 'Wind Direction [degrees]',
                        style: {
                            color: Highcharts.getOptions().colors[3]
                        }
                    },
                    // labels: {
                    //     format: '{value}°',
                    //     style: {
                    //         color: Highcharts.getOptions().colors[3]
                    //     }
                    // },
                    // labels: {
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
                    // height: '50%',
                    // top: '50%',
                    lineColor: Highcharts.getOptions().colors[3],
                    lineWidth: 5,
                    max: 360,
                    tickInterval: 90
                },
                { 
                    labels: {
                        format: '{value} m/s',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: 'Wind Speed [m/s]',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true,
                    lineColor: Highcharts.getOptions().colors[0],
                    lineWidth: 5,
                    gridLineWidth: 0,
                }, 
            ],
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name} {point.y}°</b><br>',
                            pointFormat: '{point.x:%m/%d/%y %H:%M:%S}'
                        }
                    },
                    line: {
                        tooltip: {
                            headerFormat: '<b>{series.name} {point.y} m/s</b><br>',
                            pointFormat: '{point.x:%m/%d/%y %H:%M:%S}'
                            // pointFormat: '',
                            // footerFormat: '{point.x:%m/%d/%y %H:%M:%S}<br>'
                        }
                    },
                },
                // tooltip: {
                //     shared: true,
                // },
                series: [
                    {
                        name: 'Wind Direction Clean',
                        selected: true,
                        yAxis: 0,
                        color: Highcharts.getOptions().colors[1],
                        type: 'scatter',
                        // type: 'windbarb',
                        // keys: ['x', 'value', 'direction'],
                        // data: [],
                        // tooltip: {
                        //     pointFormatter: function() {
                        //         return "<b>Wind Direction " + this.direction + "°</b><br>"
                        //     }
                        // },
                        // zoneAxis: 'x',
                    },
                    {
                        name: 'Wind Direction Live',
                        selected: true,
                        yAxis: 0,
                        color: Highcharts.getOptions().colors[3],
                        type: 'scatter',
                        // dashStyle: 'dash',
                        // type: 'windbarb',
                        // keys: ['x', 'value', 'direction'],
                        // data: [],
                        // tooltip: {
                        //     pointFormatter: function() {
                        //         return "<b>Wind Direction " + this.direction + "°</b><br>"
                        //     }
                        // }
                    },
                    {
                        name: 'Wind Speed Clean',
                        data: [],
                        selected: true,
                        yAxis: 1,
                        color: Highcharts.getOptions().colors[0],
                        type: 'line',
                        // zoneAxis: 'x',
                        
                    },
                    {
                        name: 'Wind Speed Live',
                        data: [],
                        selected: true,
                        yAxis: 1,
                        color: Highcharts.getOptions().colors[0],
                        dashStyle: 'dash',
                    },
                    
                    
                ],
                updateTime: {
                    setTime: 0,
                    endTime: 0,
                },

    })
    const [solarRadiationChartProps,setSolarRadiationChartProps] = useState({
        chart: {
            zoomType: 'x',
            events: {
                load() {
                    this.showLoading();
                }
            }
        },
        time: {
            useUTC: false,
            //timezone: 'America/Los_Angeles'
        },
        //timezoneOffset: 420,
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            title: {
                text: 'Solar [W/m2]',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            lineColor: Highcharts.getOptions().colors[4],
            lineWidth: 5,
        },
    
        series: [
            {
                name: 'Solar Radiation Clean',
                data: [],
                selected: true,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'Solar Radiation Live',
                data: [],
                selected: true,
                dashStyle: 'dash',
                color: Highcharts.getOptions().colors[4]
            }
        ],
        tooltip: {
            headerFormat: '<b>{series.name} {point.y} W/m2</b><br>',
            pointFormat: '{point.x:%m/%d/%y %H:%M:%S} PST'
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

    var real_time_url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
    let real_search_params = real_time_url.searchParams;
    real_search_params.set('id',props.id);
  
    real_search_params.set('rptdate', convertDate(startGraphDate)); // at most 180 days away from endDate
    real_search_params.set('rptend', convertDate(endGraphDate));
    real_time_url.search = real_search_params.toString();
  
    var clean_data_url = new URL('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');
    var search_params = clean_data_url.searchParams;
    search_params.set('id',props.id);
    search_params.set('start',convertDate(startGraphDate));
    search_params.set('end',convertDate(endGraphDate));
    clean_data_url.search = search_params.toString();
  
    var clean_url = clean_data_url.toString();
    const cleanMetData = useFetch(clean_url);
  
    const realTimeData = useFetch(real_time_url.toString());

    useEffect(()=> {
        if (!cleanMetData.isLoading && !realTimeData.isLoading) {
            let relHumidityData = getFilteredData(cleanMetData.data,"Rel_Humidity");
            let airTempData = getFilteredData(cleanMetData.data,"Air_Temp");
            let atmPresData = getFilteredData(cleanMetData.data,"Atm_Pres");
            let windSpeedData = getFilteredData(cleanMetData.data,"Wind_Speed");
            let windDirData = getFilteredData(cleanMetData.data,"Wind_Dir");
            let solarRadData = getFilteredData(cleanMetData.data,"Solar_Rad");

            let realTimeRelHumidityData = getFilteredData(realTimeData.data,"Rel_Humidity");
            let realTimeAirTempData = getFilteredData(realTimeData.data,"Air_Temp");
            let realTimeAtmPresData = getFilteredData(realTimeData.data, "Atm_Pres"); // start from lastdate
            let realTimeWindSpeedData = getFilteredData(realTimeData.data,"Wind_Speed");
            let realTimeWindDirData = getFilteredData(realTimeData.data,"Wind_Dir");            
            let realTimeSolarRadData = getFilteredData(realTimeData.data, "Solar_Rad"); // start from lastdate

            if (atmPresData.length != 0) {
                var lastdate = atmPresData[0][0]
                
                let dataLastDate = new Date(atmPresData[0][0]);
                let realDataLastDate = new Date(realTimeAtmPresData[0][0]);
                let realDataFirstDate = new Date(realTimeAtmPresData[realTimeAtmPresData.length-1][0])
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    realTimeAtmPresData = []
                    lastdate = undefined
                }
                realTimeAtmPresData = removePast(realTimeAtmPresData, lastdate);
            }

            setAtmPressureChartProps({...atmPressureChartProps,
                series: [
                {
                    data: atmPresData
                },
                {
                    data: realTimeAtmPresData
                }
            ],
            xAxis: {
                plotLines: [{
                    color: '#FF0000',
                    width: 5,
                    value: lastdate
                }]
            }})
            
            if (solarRadData.length != 0) {
                var lastdate = solarRadData[0][0]     
                let dataLastDate = new Date(solarRadData[0][0]);
                let realDataLastDate = new Date(realTimeSolarRadData[0][0]);
                let realDataFirstDate = new Date(realTimeSolarRadData[realTimeSolarRadData.length-1][0])
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    realTimeSolarRadData = []
                    lastdate = undefined
                }
                realTimeSolarRadData = removePast(realTimeSolarRadData, lastdate);
            }
            
            setSolarRadiationChartProps({...solarRadiationChartProps,
                series: [
                {
                    data: solarRadData
                },
                {
                    data: realTimeSolarRadData
                }
            ],
            xAxis: {
                plotLines: [{
                    color: '#FF0000',
                    width: 5,
                    value: lastdate
                }]
            }})
            if (relHumidityData.length != 0) {
                var lastdate = relHumidityData[0][0]

                let dataLastDate = new Date(relHumidityData[0][0]);
                let realDataLastDate = new Date(realTimeRelHumidityData[0][0]);
                let realDataFirstDate = new Date(realTimeRelHumidityData[realTimeRelHumidityData.length-1][0])
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    realTimeRelHumidityData = []
                    lastdate = undefined
                }
                realTimeRelHumidityData = removePast(realTimeRelHumidityData, lastdate);
            }

            if (airTempData.length != 0) {
                lastdate = relHumidityData[0][0];
                let dataLastDate = new Date(airTempData[0][0]);
                let realDataLastDate = new Date(realTimeAirTempData[0][0]);
                let realDataFirstDate = new Date(realTimeAirTempData[realTimeAirTempData.length-1][0])            
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    realTimeAirTempData = []
                    lastdate = undefined
                }
                realTimeAirTempData = removePast(realTimeAirTempData, lastdate);
            }

            setAirTemp_RelHumChartProps({...airTemp_RelHumChartProps,
                series: [
                    {
                        data: airTempData
                    },
                    {
                        data: realTimeAirTempData
                    },
                    {
                        data: relHumidityData
                    },
                    {
                        data: realTimeRelHumidityData
                    }
                ],
                xAxis: {
                    plotLines: [{
                        color: '#FF0000',
                        width: 5,
                        value: lastdate
                    }]
                }
            })

            if (windSpeedData.length != 0) {
                var lastdate = windSpeedData[0][0]
                
                let dataLastDate = new Date(windSpeedData[0][0]);
                let realDataLastDate = new Date(realTimeWindSpeedData[0][0]);
                let realDataFirstDate = new Date(realTimeWindSpeedData[realTimeWindSpeedData.length-1][0])
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    realTimeWindSpeedData = []
                    lastdate = undefined
                }
                realTimeWindSpeedData = removePast(realTimeWindSpeedData, lastdate);
            }

            if (windDirData.length != 0) {
                lastdate = windSpeedData[0][0];
                let dataLastDate = new Date(windDirData[0][0]);
                let realDataLastDate = new Date(realTimeWindDirData[0][0]);
                let realDataFirstDate = new Date(realTimeWindDirData[realTimeWindDirData.length-1][0])            
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    realTimeWindDirData = []
                    lastdate = undefined
                }
                realTimeWindDirData = removePast(realTimeWindDirData, lastdate);
                
            }
            setWindSpeedDirChart({...windSpeedDirChart,
                series: [
                    {
                        data: windDirData
                    },
                    {
                        data: realTimeWindDirData
                    },
                    {
                        data: windSpeedData
                    },
                    {
                        data: realTimeWindSpeedData
                    }
                ],
                xAxis: {
                    plotLines: [{
                        color: '#FF0000',
                        width: 5,
                        value: lastdate
                    }]
                }
            })
        }
        
      },[cleanMetData.isLoading, realTimeData.isLoading])

    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>
            <div className='data-desc-container'>
                <p className='data-desc'>Select start and end dates (maximum 150 day period). <br/>
                    Click submit to update the graphs below.<br/>
                    Allow some time for the data to be fetched. The longer the selected time period, the longer it will take to load.<br/>
                    Use the hamburger icon on the top right of each graph to download the data displayed in the graph.<br/>
                    Click and drag in the plot area to zoom in.<br/>
                    Solid line means data comes from database with cleaned data, while dashed line means data is real time.
                </p>
            </div>
            <DateRangePicker 
                startDate={startDate} 
                endDate={endDate} 
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                setGraphDates={setGraphDates} 
                maxDays={150}/>
            <MetChart 
                chartProps={airTemp_RelHumChartProps}
                isLoading={realTimeData.isLoading||cleanMetData.isLoading}
             />
             <div className='chart-container'> 
            <MetChart 
                chartProps={atmPressureChartProps}
                isLoading={realTimeData.isLoading||cleanMetData.isLoading}
             />
             </div>
            <MetChart 
                chartProps={windSpeedDirChart}
                isLoading={realTimeData.isLoading||cleanMetData.isLoading}
             />
              <div className='chart-container'> 
            <MetChart 
                chartProps={solarRadiationChartProps}
                isLoading={realTimeData.isLoading||cleanMetData.isLoading}
             />
             </div>
        </div>
        
    )
}