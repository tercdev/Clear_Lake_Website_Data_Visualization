import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import StreamChart from '../streams/StreamChart';
import useFetch from 'react-fetch-hook';
import SpecificDateSelect from './SpecificDateSelect';

import './LakeCTD.css';

export default function LakeCTD(props) {
    function getFilteredData(data, dataType) {
        let m = []
        data.forEach((element => {
            m.push([parseFloat(element.Depth), parseFloat(element[dataType])]);
        }))
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
        subtitle: {
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>Click on the name of the series in the legend on the bottom to hide / show the series on the graph.'
        },
        credits: {
            enabled: false,
        },
        xAxis: [{
            reversed: false,
            title: {
                enabled: true,
                text: 'Depth [m]'
            },
            labels: {
                format: '{value} m'
            },
            max: 0,
            gridLineWidth: 1
        }],
        yAxis: [{
            title: {
                text: 'Chlorophyll [ug/l]',
                style: {
                    color: Highcharts.getOptions().colors[7]
                }
            },
            labels: {
                format: '{value} ug/l',
                style: {
                    color: Highcharts.getOptions().colors[7]
                }
            },
            lineColor: Highcharts.getOptions().colors[7],
            lineWidth: 5,
            opposite: true,
            showLastLabel: false
        }, {
            title: {
                text: 'Dissolved Oxygen [mg/l]',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mg/l',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            opposite: true,
            showLastLabel: false
        }, {
            title: {
                text: 'Specific Conductivity [uS/cm]',
                style: {
                    color: Highcharts.getOptions().colors[5]
                }
            },
            labels: {
                format: '{value} uS/cm',
                style: {
                    color: Highcharts.getOptions().colors[5]
                }
            },
            lineColor: Highcharts.getOptions().colors[5],
            lineWidth: 5,
            showLastLabel: false
        }, {
            title: {
                text: 'Temperature [°C]',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            labels: {
                format: '{value} °C',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
            showLastLabel: false
        }, {
            title: {
                text: 'Turbidity [FTU]',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            labels: {
                format: '{value} FTU',
                style: {
                    color: Highcharts.getOptions().colors[4]
                }
            },
            lineColor: Highcharts.getOptions().colors[4],
            lineWidth: 5,
            showLastLabel: false
        }],
        tooltip: {
            formatter: function() {
                let units = {
                    "Chlorophyll": "ug/l",
                    "Dissolved Oxygen": 'mg/l',
                    "Specific Conductivity": 'uS/cm',
                    "Temperature": '°C',
                    "Turbidity": 'FTU'
                }
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' +
                        point.y + ' ' + units[point.series.name];
                }, '<b>' + this.x + ' m' + '</b>');
            },
            shared: true,
            followPointer: true
        },
        series: [{
            name: 'Chlorophyll',
            data: [],
            selected: true,
            yAxis: 0,
            color: Highcharts.getOptions().colors[7]
        }, {
            name: 'Dissolved Oxygen',
            data: [],
            selected: true,
            yAxis: 1,
            color: Highcharts.getOptions().colors[0]
        }, {
            name: 'Specific Conductivity',
            data: [],
            selected: true,
            yAxis: 2,
            color: Highcharts.getOptions().colors[5]
        }, {
            name: 'Temperature',
            data: [],
            selected: true,
            yAxis: 3,
            color: Highcharts.getOptions().colors[3]
        }, {
            name: 'Turbidity',
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
    // var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    const [startDate, setStartDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(today);
    const [endGraphDate, setGraphEndDate] = useState(today);
    function handleStartDateChange(e) {
        console.log(e)
        // setStartDate(new Date(e[0]));
        setStartDate(e)
    }
    function setGraphDates() {
        console.log(startDate)
        setGraphStartDate(startDate);
        // let x = new Date(startDate.getFullYear(), startDate.getMonth(), 28);
        setGraphEndDate(startDate);
    }
    function convertDatetoUTC(date) {
        let year = date.getUTCFullYear().toString();
        let month = (date.getUTCMonth()+1).toString();
        let day = date.getUTCDate().toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return year+month+day;
    }
    var url = new URL('https://3kgpak926a.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata');
    var search_params = url.searchParams;
    search_params.set('id',props.id);
    search_params.set('start',convertDatetoUTC(startGraphDate));
    search_params.set('end',convertDatetoUTC(endGraphDate));
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
            // let depthData = getFilteredData(profileData.data, "Depth");
            // console.log(chlaData)
            // console.log(JSON.stringify(chlaData))
            setChartProps({...chartProps,
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
    var dates_url = new URL('https://shb928ssb8.execute-api.us-west-2.amazonaws.com/default/clearlake-met-sitedates');
    var dates_search_params = dates_url.searchParams;
    dates_search_params.set('id', props.id);
    dates_url.search = dates_search_params.toString();
    const includedDates = useFetch(dates_url.toString());
    const [dates, setDates] = useState([]);
    useEffect(() => {
        if (!includedDates.isLoading) {
            let m = [];
            includedDates.data.forEach((element => {
                m.push(new Date(element["DateTime_UTC"]));
            }))
            setDates(m);
            console.log(m)
            console.log(includedDates.data)
        }
    },[includedDates.isLoading])
    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer />
            <div className='data-desc-container'>
                <p className='data-desc'>Select year, month, and date. <br/>
                    Click submit to update the graphs below.<br/>
                </p>
            </div>
            <div className='date-container'>
                <SpecificDateSelect 
                    data={includedDates.data} 
                    isLoading={includedDates.isLoading} 
                    onSelect={handleStartDateChange}
                />
                <button className="submitButton" onClick={setGraphDates}>Submit</button>
            </div>
            <div className='chart-container-half'>
                <StreamChart chartProps={chartProps} isLoading={profileData.isLoading}/>
            </div>
        </div>
        
    )
}