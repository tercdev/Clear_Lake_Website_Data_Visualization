import React, { useState } from 'react';
import Highcharts from 'highcharts';
import MetChart from './MetChart.js';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
                            if (point.series.name  == 'Relative Humidity') {
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
                name: 'Atmospheric Pressure',
                data: [],
                selected: true,
                color: Highcharts.getOptions().colors[4]
            },
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
                    type: 'datetime'
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
                                0: 'South',
                                90: 'West',
                                180: 'North',
                                270: 'East',
                                360: 'South'
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
                        }
                    }
                },
    
                series: [
                    {
                        name: 'Wind Direction',
                        data: [],
                        selected: true,
                        yAxis: 0,
                        color: Highcharts.getOptions().colors[3],
                        type: 'scatter',
                    },
                    {
                        name: 'Wind Speed',
                        data: [],
                        selected: true,
                        yAxis: 1,
                        color: Highcharts.getOptions().colors[0],
                        type: 'line',
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

    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <div className='data-disclaimer'>
                <p className='disclaimer1'>Note: These data are provisional and not error checked!</p>
                <p className='disclaimer2'>These data were collected and are currently being processed and analyzed by 
                    the UC Davis Tahoe Environmental Research Center (TERC). They are 
                    considered preliminary. Do not use or distribute without written permission 
                    from TERC.</p>
                <p className='disclaimer2'>For all questions please contact Dr. Shohei Watanabe (swatanabe@ucdavis.edu) or Dr. Alicia Cortes (alicortes@ucdavis.edu)</p>
            </div>
            <div className='date-container'>
                <div className='one-date-container'>
                <p>Start Date</p>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                />
                </div>
                <div className='one-date-container'>
                <p>End Date</p>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                />
                </div>
            </div>
            <MetChart 
                fromDate={startDate} 
                endDate={endDate} 
                id={props.id}
                dataType={"Rel_Humidity"}
                dataType2={"Air_Temp"}
                chartProps={MyAirTemp_RelHumChartProps}
             />
            <MetChart 
                fromDate={startDate} 
                endDate={endDate} 
                id={props.id}
                dataType={"Atm_Pres"}
                chartProps={MyAtmPressureChartProps}
             />
            <MetChart 
                fromDate={startDate} 
                endDate={endDate} 
                id={props.id}
                dataType={"Wind_Speed"}
                dataType2={"Wind_Dir"}
                chartProps={MyWindSpeedDirChart}
             />
        </div>
        
    )
}