import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import Chart from '../../Chart';
import useFetch from 'react-fetch-hook';
import { convertDate } from '../../utils';
import DatePicker from 'react-datepicker';
import CollapsibleItem from '../../CollapsibleItem';
import '../../DateRangePicker.css';

require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/boost')(Highcharts);

export default function LakeTchain(props) {
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            type: 'heatmap',
            height: 700,
            events: {
                load() {
                    this.showLoading();
                },
                render() {
                    console.log(this)
                    // legend titles
                    this.renderer.text('Temperature [°C]', this.chartWidth-30, 165)
                    .attr({
                        rotation: 90
                    })
                    .css({
                        // color: '#4572A7',
                        // fontSize: '16px'
                    })
                    .add();
                    this.renderer.text('Dissolved Oxygen [mg/L]', this.chartWidth-30, 470)
                    .attr({
                        rotation: 90
                    })
                    .css({
                        // color: '#4572A7',
                        // fontSize: '16px'
                    })
                    .add();
                    // dots
                    // this.renderer.symbol('circle', this.xAxis[0].toPixels(0), this.yAxis[0].toPixels(2));
                }
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>White Dots represent depth of the loggers. Black line is the depth of the water column'
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
            title: {
                text: 'Temperature []'
            },
            stops: [
                [0, '#183067'], // darker
                [0.1, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a'],
                [1, '#62231d'] // darker
                // [0, '#1e3a8a'], // blue
                // [0.1, '#1d4ed8'],
                // [0.2,'#3b82f6'],
                // // [0.15, '#1c6ff8'],
                // [0.28, '#27bbe0'],
                // [0.36, '#31db92'],
                // // [0.38, '#7ed663'],
                // [0.44, '#9bfa24'],
                // // [0.3, '#93c5fd'],
                // // [0.4, '#dbeafe'], // almost white blue
                // // [0.35, '#64ff64'], // green
                // [0.5, '#ffee00'], // yellow
                // [0.58, '#fbb806'],
                // [0.66, '#f6830c'],
                // [0.74, '#f24d11'],
                // [0.82, '#ed1717'],
                // // [0.6, '#fee2e2'], // almost white red
                // // [0.65, '#fda500'], // orange
                // // [0.7, '#fca5a5'],// pink
                // // [0.8, '#ef4444'],
                // [0.9, '#b91c1c'],
                // [1, '#7f1d1d'] // red
            ],
            min: 7,
            max: 28,
            startOnTick: false,
            endOnTick: false,
            layout: 'vertical',
            labels: {
                format: '{value}°C'
            },
            reversed: false
        }, {
            title: {
                text: 'Dissolved Oxygen [mg/L]'
            },
            stops: [
                [0, '#c4463a'],
                [0.1, '#c4463a'],
                [0.5, '#fffbbc'],
                [1, '#3060cf']
            ],
            min: 0,
            max: 15,
            layout: 'vertical',
            labels: {
                format: '{value} mg/L'
            },
            reversed: false
        }],
        legend: {
            layout: 'vertical',
            verticalAlign: 'middle',
            align: 'right',
            // padding: 20,
            itemMarginTop: 35, // increase moves bottom one down
            itemMarginBottom: 40, // increase moves top one up
            width: 100,
            // itemWidth: 100,
            y: 30,
            // symbolHeight: 275,
            symbolHeight: 250,
            // maxHeight: 700
            navigation: {
                enabled: false
            }
        },
        series: [{
            name: 'Temperature',
            data: [],
            type: 'heatmap',
            boostThreshold: 100, // ?
            borderWidth: 0, // ?
            nullColor: '#EFEFEF',
            colsize: 36e5, // 1 hour
            tooltip: {
                headerFormat:'<b>Temperature</b><br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}°C'
            },
        }, {
            name: 'Dissolved Oxygen',
            data: [],
            type: 'heatmap',
            boostThreshold: 100, // ?
            borderWidth: 0, // ?
            nullColor: '#EFEFEF',
            colsize: 36e5, // 1 hour
            tooltip: {
                headerFormat:'<b>Dissolved Oxygen</b><br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}mg/L'
            },
            yAxis: 1,
            colorAxis: 1
        }, {
            name: 'Maximum Depth',
            data: [],
            type: 'line',
            yAxis: 1,
            colorAxis: 1, // always gets associated with a color axis
            color: Highcharts.getOptions().colors[1],
            lineWidth: 2,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[1],
                fillColor: Highcharts.getOptions().colors[1],
            },
            selected: true,
            tooltip: {
                headerFormat:'<b>Maximum Depth</b><br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M}, {point.y}m'
            },
        }, {
            name: 'Instrument Location for Temperature',
            data: [],
            type: 'scatter',
            yAxis: 0,
            colorAxis: 0,
            color: Highcharts.getOptions().colors[0],
            marker: {
                // lineWidth: 5,
                // lineColor: Highcharts.getOptions().colors[0],
                fillColor: '#fff',
                lineColor: 'black',
                lineWidth: 1,
                symbol: 'circle'
            },
            tooltip: {
                headerFormat:'<b>Instrument Location</b><br/>',
                pointFormat: '{point.y}m'
            },
        }, {
            name: 'Instrument Location for Dissolved Oxygen',
            data: [],
            type: 'scatter',
            yAxis: 1,
            colorAxis: 1,
            color: Highcharts.getOptions().colors[0],
            marker: {
                // lineWidth: 5,
                // lineColor: Highcharts.getOptions().colors[0],
                fillColor: '#fff',
                lineColor: 'black',
                lineWidth: 1,
                symbol: 'circle'
            },
            tooltip: {
                headerFormat:'<b>Instrument Location</b><br/>',
                pointFormat: '{point.y}m'
            },
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
    function getFilteredData(data, dataType, isInstrument = false) {
        let m = []
        if (isInstrument && data.length != 0) {
            Object.keys(data[0]).forEach(key => {
                let re = /^Height_([^m]*)m$/;
                console.log(re.exec(key))
                if (re.exec(key) !== null) {
                    m.push([new Date(data[0].DateTime_UTC).getTime(),parseFloat(re.exec(key)[1])])
                }
            })
            if (dataType == "temp") {
                m.push([new Date(data[0].DateTime_UTC).getTime(),parseFloat(data[0].Height_max)])
            }
            console.log(m)
            return m
        }
        if (dataType == "depth") {
            data.forEach((element => {
                m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element["Height_max"])])
            }))
        } else if (dataType == "oxy") {
            data.forEach((element => {
                //start data
                let s = 0.5;

                let i = s;

                //end data
                let e = -1;

                let stri = "Height_0.5m";
                m.push([new Date(element.DateTime_UTC).getTime(),s, parseFloat(element["Height_0.5m"])]);
                while (i <= 15.00) {
                    e = -1;
                    let val = Math.round(i*100)/100;
                    let strings = "Height_" + val + "m";
                    
                    //finds end height by increment every 0.01m
                    if (element[strings] != null) {
                    
                        e = val;
                        //ending height
                        let ending = "Height_" + e + "m";
                        let h = Math.ceil(s);
                        let end = Math.ceil(e);

                        let init = -1;
                        let v = -1;
                        if (s%1 == 0) {
                            init = h+1;
                            v = h;
                        } else {
                            init = h;
                            v = h-1;
                        }
                        

                        for (let j = init; j < end && e-s != -1; j++) {
                            //retrieves the dissolved oxygen at the lake surface and the dissolved oxygen at height h-1 meters and using those values to predict the dissolved oxygen at height j meters
                            let strVal = "Height_" + h + "m";
                            let values =  (((j-(v))/(e-(v))) * (parseFloat(element[ending]) - parseFloat(element[stri])) + parseFloat(element[stri]));
                            let val = Math.round(j*100)/100;
                            m.push([new Date(element.DateTime_UTC).getTime(),val, Math.round(values*100)/100]);
                        }
                        m.push([new Date(element.DateTime_UTC).getTime(),Math.round(e*100)/100, parseFloat(element[ending])]);
                        stri = ending;
                        s = e;
                        e = -1;
                    }
                    i += 0.01;
                }

            }))
        } else if (dataType == "temp") {
            data.forEach((element => {
                //start data
                let s = 0.5;

                let i = s;

                //end data
                let e = -1;

                let stri = "Height_0.5m";
                //initial height 0.5m given
                let heightMax = parseFloat(element["Height_max"]);
                while (i <= heightMax) {
                    e = -1;
                    let val = Math.round(i*100)/100;
                    let strings = "Height_" + val + "m";

                    //finds end height by increment every 0.01m
                    if (element[strings] != null) {
                        
                        //adds start data to m
                        m.push([new Date(element.DateTime_UTC).getTime(),s,parseFloat(element[stri])]);

                        //end height set to value of i
                        e = val;


                        let ending = "Height_" + e + "m";

                        //start height for interpolate
                        let h = Math.ceil(s);

                        //end height - 1 for interpolate
                        let end = Math.ceil(e);

                        console.log("Start: " + s);
                        console.log("End: " + e);
                        let init = -1;
                        let v = -1;
                        if (s%1 == 0) {
                            init = h+1;
                            v = h;
                        } else {
                            init = h;
                            v = h-1;
                        }

                        //don't do interpolation if end and start are exactly 1 apart
                        for (let j = init; j < end && e-s != 1; j++) {
                            //retrieves the temp at the lake surface and the temp at height h-1 meters and using those values to predict the temp at height j meters
                            let strVal = "Height_" + h + "m";
                            let values =  (((j-(v))/(e-(v))) * (parseFloat(element[ending]) - parseFloat(element[stri])) + parseFloat(element[strVal]));
                            m.push([new Date(element.DateTime_UTC).getTime(),Math.round(j*100)/100, Math.round(values*100)/100]);
                        }
                        s = e;
                        stri = ending;
                        e = -1;

                    }
                    i += 0.01;
                }
                m.push([new Date(element.DateTime_UTC).getTime(),s,parseFloat(element[stri])]);
                //end height set to value of i
                e = heightMax;
                //start height for interpolate
                let h = Math.ceil(s);

                let init = -1;
                let v = -1;
                if (s%1 == 0) {
                    init = h+1;
                    v = h;
                } else {
                    init = h;
                    v = h-1;
                }

                //don't do interpolation if end and start are exactly 1 apart
                for (let j = init; j < heightMax && e-s != 1; j++) {
                    //retrieves the temp at the lake surface and the temp at height h-1 meters and using those values to predict the temp at height j meters
                    let values =  (((j-(v))/(e-(v))) * (parseFloat(element["Height_surface"]) - parseFloat(element[stri])) + parseFloat(element[stri]));
                    m.push([new Date(element.DateTime_UTC).getTime(),Math.round(j*100)/100, Math.round(values*100)/100]);
                }
                m.push([new Date(element.DateTime_UTC).getTime(),heightMax,parseFloat(element["Height_surface"])]);
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
            let depthFiltered = getFilteredData(oxyData.data, "depth");
            console.log(depthFiltered)
            let oxyInstrument = getFilteredData(oxyData.data, "oxy", true);
            let tempInstrument = getFilteredData(tempData.data, 'temp', true)
            setChartProps({...chartProps,
                series: [{
                    data: tempFiltered
                },{
                    data: oxyFiltered
                }, {
                    data: depthFiltered
                }, {
                    data: tempInstrument
                }, {
                    data: oxyInstrument
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

    // for the collapsible FAQ
    const header1 = "How to use the graphs and see the data below?";
    const content1 = [<ol>
            <li>Select start and end dates with maximum 365-day period. Time is in ? time.</li>
            <li>Click submit to update the graphs below.</li>
            <li>Graph and data loading will depend on the length of the selected time period.</li>
        </ol>];

    const header2 = "Why is no data showing up on my plots?";
    const content2 = [<p>If there is no data, check <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a> to read more about the metadata.</p>];

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
            <Chart chartProps={chartProps} isLoading={oxyData.isLoading || tempData.isLoading} />
        </div>
        
    )
    }

