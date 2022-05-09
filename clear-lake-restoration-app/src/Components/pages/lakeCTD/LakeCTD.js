import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import StreamChart from '../streams/StreamChart';
import useFetch from 'react-fetch-hook';
import { convertDate } from '../../utils';
import DatePicker from 'react-datepicker';

export default function LakeCTD(props) {
    function getFilteredData(data, dataType) {
        let m = []
        if (dataType == "Depth") {
            data.forEach((element => {m.push([element.Depth])}));
        } else {
            data.forEach((element => {
                m.push([element.Depth, parseFloat(element[dataType])]);
            }))
        }
        m.sort(function(a,b) {
            return (a[0]-b[0])
        })
        let uniq = []
        let b = m.filter(function (v) {
            if (uniq.indexOf(v.toString()) < 0) {
                uniq.push(v.toString())
                return v
            }
        })
        return b
    }
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            type: 'spline',
            inverted: true,
            height: 1200
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false,
        },
        xAxis: [{
            reversed: false,
            title: {
                enabled: true,
                text: 'Depth'
            },
            labels: {
                format: '{value}'
            },
            showLastLabel: true
        }],
        yAxis: [{
            title: {
                text: 'Chla',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            opposite: true
        }, {
            title: {
                text: 'Dissolved Oxygen',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            lineColor: Highcharts.getOptions().colors[1],
            lineWidth: 5,
            opposite: true
        }, {
            title: {
                text: 'SpeCond',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            lineColor: Highcharts.getOptions().colors[2],
            lineWidth: 5,
        }, {
            title: {
                text: 'Temp',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
        }, {
            title: {
                text: 'Turb',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            lineColor: Highcharts.getOptions().colors[4],
            lineWidth: 5,
        }],
        tooltip: {
            formatter: function() {
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' +
                        point.y;
                }, '<b>' + this.x + '</b>');
            },
            shared: true,
            followPointer: true
        },
        series: [{
            name: 'Chla',
            data: [],
            selected: true,
            yAxis: 0,
            color: Highcharts.getOptions().colors[0]
        }, {
            name: 'Dissolved Oxygen',
            data: [],
            selected: true,
            yAxis: 1,
            color: Highcharts.getOptions().colors[1]
        }, {
            name: 'Spe Cond',
            data: [],
            selected: true,
            yAxis: 2,
            color: Highcharts.getOptions().colors[2]
        }, {
            name: 'Temp',
            data: [],
            selected: true,
            yAxis: 3,
            color: Highcharts.getOptions().colors[3]
        }, {
            name: 'Turb',
            data: [],
            selected: true,
            yAxis: 4,
            color: Highcharts.getOptions().colors[4]
        }],
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
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
    const [startGraphDate, setGraphStartDate] = useState(lastWeek);
    const [endGraphDate, setGraphEndDate] = useState(today);
    function handleStartDateChange(e) {
        setStartDate(e);
    }
    function setGraphDates() {
        setGraphStartDate(startDate);
        let x = new Date(startDate.getFullYear(), startDate.getMonth(), 28);
        setGraphEndDate(x);
    }
    var url = new URL('https://3kgpak926a.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata');
    var search_params = url.searchParams;
    search_params.set('id',props.id);
    search_params.set('start',convertDate(startGraphDate));
    search_params.set('end',convertDate(endGraphDate));
    url.search = search_params.toString();
    var new_url = url.toString();
    const profileData = useFetch(new_url);
    useEffect(() => {
        if (!profileData.isLoading) {
            console.log(profileData.data)
            let chlaData = getFilteredData(profileData.data, "Chla");
            let doData = getFilteredData(profileData.data, "DO");
            let speCondData = getFilteredData(profileData.data, "SpeCond");
            let tempData = getFilteredData(profileData.data, "Temp");
            let turbData = getFilteredData(profileData.data, "Turb");
            let depthData = getFilteredData(profileData.data, "Depth");
            console.log(chlaData)
            setChartProps({...chartProps,
                xAxis: [{
                    categories: depthData
                }],
                series: [
                    {
                        data: chlaData
                    },
                    {
                        data: doData
                    }, 
                    {
                        data: speCondData
                    },
                    {
                        data: tempData
                    },
                    {
                        data: turbData
                    }
                ]
            })
        }
    },[profileData.isLoading,startGraphDate])
    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer />
            <div className='date-container'>
                {/* <div className='one-date-container'> */}
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        minDate={new Date("2019/01/01")}
                        maxDate={today}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                    />
                {/* </div> */}
                <button className="submitButton" onClick={setGraphDates}>Submit</button>
            </div>
            <StreamChart chartProps={chartProps} isLoading={profileData.isLoading}/>
        </div>
        
    )
}