import React, { useState } from 'react';

import Highcharts from 'highcharts';
import MetChart from '../../MetChart.js';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import DataDisclaimer from '../../DataDisclaimer.js';
import DateRangePicker from '../../DateRangePicker.js';

export default function Met(props) {
    var MyAirTemp_RelHumChartProps = {
        chart: {
            zoomType: 'x',
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
    };
    var MyAtmPressureChartProps = {
        chart: {
            zoomType: 'x'
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
                name: 'Atmospheric Pressure Cleaned',
                data: [],
                selected: true,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'Atmospheric Pressure Live',
                data: [],
                selected: true,
                dashStyle: 'dash',
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
    }
    var MyWindSpeedDirChart = {
                chart: {
                    zoomType: 'x',
                    // height: 700,
                },
                time : {
                    useUTC:false
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    offset: 40
                },
                yAxis: 
                [{ 
                //     title: {
                //         text: 'Wind Direction [degrees]',
                //         style: {
                //             color: Highcharts.getOptions().colors[3]
                //         }
                //     },
                //     // labels: {
                //     //     format: '{value}°',
                //     //     style: {
                //     //         color: Highcharts.getOptions().colors[3]
                //     //     }
                //     // },
                //     // labels: {
                //     tickPositions: [0, 90, 180, 270, 360],
                //     labels: {
                //         formatter: function() {
                //             var obj = {
                //                 0: 'South',
                //                 90: 'West',
                //                 180: 'North',
                //                 270: 'East',
                //                 360: 'South'
                //             }
                //         return (obj[this.value])
                //         }
                //     },
                //     // height: '50%',
                //     // top: '50%',
                //     lineColor: Highcharts.getOptions().colors[3],
                //     lineWidth: 5,
                //     max: 360,
                //     tickInterval: 90
                // },
                // { 
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
                    // opposite: true,
                    lineColor: Highcharts.getOptions().colors[0],
                    lineWidth: 5,
                    gridLineWidth: 0,
                }, 
            ],
                plotOptions: {
                    // scatter: {
                    //     marker: {
                    //         radius: 5,
                    //         states: {
                    //             hover: {
                    //                 enabled: true,
                    //                 lineColor: 'rgb(100,100,100)'
                    //             }
                    //         }
                    //     },
                    //     states: {
                    //         hover: {
                    //             marker: {
                    //                 enabled: false
                    //             }
                    //         }
                    //     },
                    //     tooltip: {
                    //         headerFormat: '<b>{series.name} {point.y}°</b><br>',
                    //         pointFormat: '{point.x:%m/%d/%y %H:%M:%S}'
                    //     }
                    // },
                    line: {
                        tooltip: {
                            headerFormat: '<b>{series.name} {point.y} m/s</b><br>',
                            pointFormat: '',
                            footerFormat: '{point.x:%m/%d/%y %H:%M:%S}<br>'
                        }
                    },
                },
                tooltip: {
                    shared: true,
                },
                series: [
                    {
                        name: 'Wind Speed Clean',
                        data: [],
                        selected: true,
                        // yAxis: 1,
                        color: Highcharts.getOptions().colors[0],
                        type: 'line',
                    },
                    {
                        name: 'Wind Speed Live',
                        data: [],
                        selected: true,
                        // yAxis: 1,
                        color: Highcharts.getOptions().colors[0],
                        dashStyle: 'dash',
                    },
                    {
                        name: 'Wind Direction Clean',
                        selected: true,
                        // yAxis: 0,
                        color: Highcharts.getOptions().colors[1],
                        type: 'windbarb',
                        keys: ['x', 'value', 'direction'],
                        data: [],
                        tooltip: {
                            pointFormatter: function() {
                                return "<b>Wind Direction " + this.direction + "°</b><br>"
                            }
                        }
                    },
                    {
                        name: 'Wind Direction Live',
                        selected: true,
                        // yAxis: 0,
                        color: Highcharts.getOptions().colors[3],
                        type: 'windbarb',
                        keys: ['x', 'value', 'direction'],
                        data: [],
                        tooltip: {
                            pointFormatter: function() {
                                return "<b>Wind Direction " + this.direction + "°</b><br>"
                            }
                        }
                    },
                    
                ],
                updateTime: {
                    setTime: 0,
                    endTime: 0,
                },

    }
    var today = new Date();
    console.log(today);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    console.log(lastWeek);
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
    return (
        <div>
            <h1 className='stream'>{props.name}</h1>
            <DataDisclaimer/>
            <DateRangePicker 
                startDate={startDate} 
                endDate={endDate} 
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                setGraphDates={setGraphDates} />
            <MetChart 
                fromDate={startGraphDate} 
                endDate={endGraphDate} 
                id={props.id}
                dataType={"Rel_Humidity"}
                dataType2={"Air_Temp"}
                chartProps={MyAirTemp_RelHumChartProps}
             />
            <MetChart 
                fromDate={startGraphDate} 
                endDate={endGraphDate} 
                id={props.id}
                dataType={"Atm_Pres"}
                chartProps={MyAtmPressureChartProps}
             />
            <MetChart 
                fromDate={startGraphDate} 
                endDate={endGraphDate} 
                id={props.id}
                dataType={"Wind_Speed"}
                dataType2={"Wind_Dir"}
                chartProps={MyWindSpeedDirChart}
             />
        </div>
        
    )
}