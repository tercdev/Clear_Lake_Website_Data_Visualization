import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import StreamChart from '../streams/StreamChart';
import useFetch from 'react-fetch-hook';
import { convertDate } from '../../utils';
import DatePicker from 'react-datepicker';
import '../../DateRangePicker.css'

require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/boost')(Highcharts);

export default function LakeTchain(props) {
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            type: 'heatmap',
            height: 700
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        boost: { //??
            useGPUTranslations: true
        },
        xAxis: [{
            type: 'datetime',
        }, {
            type: 'datetime',
            offset: 0,
            top: '-57%'
        }],
        yAxis: [{
            title: {
                text: 'Height above bottom [m]'
            },
            reversed: false,
            min: 0,
            max: 15,
            height: '45%',
            offset: 0,
        }, {
            title: {
                text: 'Height above bottom [m]'
            },
            reversed: false,
            min: 0,
            max: 15,
            height: '45%',
            offset: 0,
            top: '57%',
            
        }],
        colorAxis: [{
            stops: [
                [0, '#c4463a'],
                [0.1, '#c4463a'],
                [0.5, '#fffbbc'],
                [1, '#3060cf']
            ],
            min: 0,
            max: 15,
            layout: 'horizontal',
            labels: {
                format: '{value} mg/L'
            }
        }, {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a'],
                [1, '#c4463a']
            ],
            min: 5,
            max: 30,
            layout: 'horizontal',
            labels: {
                format: '{value}°C'
            },
        }],
        series: [{
            name: 'Dissolved Oxygen',
            data: [],
            type: 'heatmap',
            boostThreshold: 100, // ?
            borderWidth: 0, // ?
            nullColor: '#EFEFEF',
            colsize: 36e5, // 1 hour
            tooltip: {
                headerFormat:'Dissolved Oxygen<br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}mg/L'
            },
        }, {
            name: 'Temperature',
            data: [],
            type: 'heatmap',
            boostThreshold: 100, // ?
            borderWidth: 0, // ?
            nullColor: '#EFEFEF',
            colsize: 36e5, // 1 hour
            tooltip: {
                headerFormat:'Temperature<br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}°C'
            },
            yAxis: 1,
            colorAxis: 1
        }],
        updateTime: {
            setTime: 0,
            endTime: 0
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
    var oxy_url = new URL('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen');
    var search_params_oxy = oxy_url.searchParams;
    search_params_oxy.set('id',props.id);
    search_params_oxy.set('start',convertDate(startGraphDate));
    search_params_oxy.set('end',convertDate(endGraphDate));
    oxy_url.search = search_params_oxy.toString();

    const oxyData = useFetch(oxy_url.toString());

    var temp_url = new URL('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature')
    var search_params_temp = temp_url.searchParams;
    search_params_temp.set('id',props.id);
    search_params_temp.set('start',convertDate(startGraphDate));
    search_params_temp.set('end',convertDate(endGraphDate));
    temp_url.search = search_params_temp.toString();
    
    const tempData = useFetch(temp_url.toString());
    function getFilteredData(data, dataType) {
        let m = []
        if (dataType == "oxy") {
            data.forEach((element => {
                m.push([new Date(element.DateTime_UTC).getTime(),0.5, parseFloat(element["Height_0.5m"])]);
                let val1m = (((1-0.5)/(2-0.5)) * (parseFloat(element["Height_2m"]) - parseFloat(element["Height_0.5m"])) + parseFloat(element["Height_0.5m"]));
                m.push([new Date(element.DateTime_UTC).getTime(),1, val1m]);
                m.push([new Date(element.DateTime_UTC).getTime(),2, parseFloat(element["Height_2m"])]);
                let val3m = (((3-2)/(6-2)) * (parseFloat(element["Height_6m"]) - parseFloat(element["Height_2m"])) + parseFloat(element["Height_2m"]));
                m.push([new Date(element.DateTime_UTC).getTime(),3, val3m]);
                let val4m = (((4-2)/(6-2)) * (parseFloat(element["Height_6m"]) - parseFloat(element["Height_2m"])) + parseFloat(element["Height_2m"]));
                m.push([new Date(element.DateTime_UTC).getTime(),4, val4m]);
                let val5m = (((5-2)/(6-2)) * (parseFloat(element["Height_6m"]) - parseFloat(element["Height_2m"])) + parseFloat(element["Height_2m"]));
                m.push([new Date(element.DateTime_UTC).getTime(),5, val5m]);
                m.push([new Date(element.DateTime_UTC).getTime(),6, parseFloat(element["Height_6m"])]);
            }))
        } else if (dataType == "temp") {
            data.forEach((element => {
                let h = -1;
                m.push([new Date(element.DateTime_UTC).getTime(),0.5,parseFloat(element["Height_0.5m"])]);
                m.push([new Date(element.DateTime_UTC).getTime(),1,parseFloat(element["Height_1m"])]);
                m.push([new Date(element.DateTime_UTC).getTime(),2,parseFloat(element["Height_2m"])]);
                m.push([new Date(element.DateTime_UTC).getTime(),3,parseFloat(element["Height_3m"])]);
                m.push([new Date(element.DateTime_UTC).getTime(),4,parseFloat(element["Height_4m"])]);
                if (element["Height_5m"] == null) {
                    h = 5;
                } else if (element["Height_6m"] == null) {
                    h = 6;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                } else if (element["Height_7m"] == null) {
                    h = 7;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),6,parseFloat(element["Height_6m"])]);
                } else if (element["Height_8m"] == null) {
                    h = 8;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),7,parseFloat(element["Height_7m"])]);
                } else if (element["Height_9m"] == null) {
                    h = 9;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),8,parseFloat(element["Height_8m"])]);
                } else if (element["Height_10m"] == null) {
                    h = 10;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),8,parseFloat(element["Height_8m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),9,parseFloat(element["Height_9m"])]);
                } else if (element["Height_11m"] == null) {
                    h = 11;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),8,parseFloat(element["Height_8m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),9,parseFloat(element["Height_9m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),10,parseFloat(element["Height_10m"])]);
                } else {
                    h = 12;
                    m.push([new Date(element.DateTime_UTC).getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),8,parseFloat(element["Height_8m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),9,parseFloat(element["Height_9m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),10,parseFloat(element["Height_10m"])]);
                    m.push([new Date(element.DateTime_UTC).getTime(),11,parseFloat(element["Height_11m"])]);
                }
                //console.log("H: " + h);
                //console.log("Hmax: " + Math.floor(parseFloat(element["Height_max"])));
                let heightM = parseFloat(element["Height_max"]);
                let heightMWhole = Math.floor(parseFloat(element["Height_max"]));
                for (let j = h; j <= heightMWhole; j++) {
                    let strVal = "Height_" + (h-1) + "m";
                    //console.log(strVal);
                    let values =  (((j-(h-1))/(heightM-(h-1))) * (parseFloat(element["Height_surface"]) - parseFloat(element[strVal])) + parseFloat(element[strVal]));
                    //console.log(((j-(h-1))/(heightM-(h-1))));
                    //console.log(parseFloat(element[strVal]));
                    m.push([new Date(element.DateTime_UTC).getTime(),j,values]);
                }
                m.push([new Date(element.DateTime_UTC).getTime(),parseFloat(element["Height_max"]),parseFloat(element["Height_surface"])]);
                h = -1;
            }))
        }
        
        // sort?
        m.sort(function(a,b) {
            return (a[0]-b[0])
        })
        return m
    }
    useEffect(() => {
        if (!oxyData.isLoading && !tempData.isLoading) {
            console.log(oxyData.data)
            let oxyFiltered = getFilteredData(oxyData.data, "oxy");
            console.log(oxyFiltered)
            console.log(tempData.data)
            let tempFiltered = getFilteredData(tempData.data, "temp");
            if (oxyFiltered.length != 0) {
                var minX = oxyFiltered[0][0];
                var maxX = oxyFiltered[oxyFiltered.length-1][0]
            }
            setChartProps({...chartProps,
                series: [{
                    data: oxyFiltered
                },{
                    data: tempFiltered
                }],
                xAxis: [{
                    min: minX,
                    max: maxX
                }, {
                    min: minX,
                    max: maxX
                }]
            })
        }
    },[startGraphDate, endGraphDate, oxyData.isLoading, tempData.isLoading])
    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>
            <div className='date-container'>
                <div className='one-date-container'>
                <p className='date-label'>Start Date</p>
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate}
                    minDate={new Date("2019/1/1")}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                />
                </div>
                <div className='one-date-container'>
                <p className='date-label'>End Date</p>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={today}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                />
                </div>
                <div className='one-date-container'>
                <button className="submitButton" onClick={setGraphDates}>Submit</button>
                </div>
            </div>
            {error && <p className='error-message'>Selected date range was more than 365 days. End date was automatically changed.</p>}
            <StreamChart chartProps={chartProps} isLoading={oxyData.isLoading || tempData.isLoading} />
        </div>
        
    )
}
