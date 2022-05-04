import React, { useEffect, useState } from 'react';
import StreamChart from './StreamChart';
import Highcharts from 'highcharts';

import DateRangePicker from '../../DateRangePicker';
import DataDisclaimer from '../../DataDisclaimer';

import "./Stream.css";

export default function Stream(props) {
    
    var tempProps = {
        chart: {
            zoomType: 'x',
            // events: {
            //     load() {
            //       console.log(this)
            //       this.showLoading();
            //       setTimeout(this.hideLoading.bind(this), 2000);
            //     }
            // }
        },
        time: {
            useUTC: false
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
            // events: {
            //     load() {
            //         console.log(this);
            //         this.showLoading();
            //         // setTimeout(this.hideLoading.bind(this), 2000);
            //     },
            //     redraw() {
            //         console.log(this);
            //         this.hideLoading();
            //     }, render() {
            //         console.log(this);
            //         this.hideLoading();
            //     }, addSeries() {
            //         this.showLoading();
            //     }
            // }
            //height: 700,
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
                    If there is no data, the sensors might not be submerged in the water. Check https://clearlakerestoration.sf.ucdavis.edu/metadata for more information. <br />
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
                fromDate={startGraphDate} 
                endDate={endGraphDate} 
                id={props.id}
                dataType={"Turb_BES"}
                dataType2={"Flow"}
                chartProps={turbProps}
             />
            <StreamChart 
                fromDate={startGraphDate} 
                endDate={endGraphDate} 
                id={props.id}
                dataType={"Turb_Temp"}
                chartProps={tempProps}
             />

        </div>
    )
}