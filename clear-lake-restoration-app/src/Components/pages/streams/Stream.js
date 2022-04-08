import React, { useEffect, useState } from 'react';
import StreamChart from '../../StreamChart';
import Highcharts from 'highcharts';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import "./Stream.css";

export default function Stream(props) {
    
    var tempProps = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'stream temperature',
            text: null
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Temperature in Celsius'
            }
        },
    
        series: [
            {
                name: 'Temperature',
                data: [],
                selected: true
            },
        ],
        tooltip: {
            headerFormat: '<b>{series.name} {point.y} °C</b><br>',
            pointFormat: '{point.x:%m/%d/%y %H:%M:%S} PST'
        },
        updateTime: {
            setTime: 0,
            endTime: 0,
        }
    }
    var turbProps = {
        chart: {
            zoomType: 'x',
            //height: 700,
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
            // height: '50%',
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
           
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
             
        ],
        updateTime: {
            setTime: 0,
            endTime: 0,
        }
    }

    var today = new Date();
    console.log(today);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    console.log(lastWeek);
    const [startDate, setStartDate] = useState(lastWeek);
    const [endDate, setEndDate] = useState(today);
    return (
        <div className="stream-container">
            <h1 className='stream'>{props.name}</h1>
            <StreamChart 
                fromDate={startDate} 
                endDate={endDate} 
                id={props.id}
                dataType={"Turb_BES"}
                chartProps={turbProps}
             />
            <StreamChart 
                fromDate={startDate} 
                endDate={endDate} 
                id={props.id}
                dataType={"Turb_Temp"}
                chartProps={tempProps}
             />
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
        </div>
    )
}