import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import Chart from '../../Chart';
import { convertDate,convertGMTtoPSTTime } from '../../utils';
import DatePicker from 'react-datepicker';
import CollapsibleItem from '../../CollapsibleItem';
import '../../DateRangePicker.css';
import useFetch from 'use-http';

require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/boost')(Highcharts);

export default function LakeTchain(props) {
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            type: 'heatmap',
            height: 700,
            time: {
                useUTC: false
            },
            events: {
                load() {
                    this.showLoading();
                },
                render() {
                    // legend titles
                    this.renderer.text('Temperature [°C]', this.chartWidth-30, 145)
                    .attr({
                        rotation: 90
                    })
                    .css({
                        // color: '#4572A7',
                        fontSize: '1rem'
                    })
                    .add();
                    this.renderer.text('Dissolved Oxygen [mg/L]', this.chartWidth-30, 450)
                    .attr({
                        rotation: 90
                    })
                    .css({
                        // color: '#4572A7',
                        fontSize: '1rem'
                    })
                    .add();
                }
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>White Dots represent depth of the loggers. Black line is the depth of the water column',
            style: {
                fontSize: '1rem'
            }
        },
        credits: {
            enabled: false
        },
        boost: { //??
            useGPUTranslations: true
        },
        xAxis: [{
            type: 'datetime',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, {
            type: 'datetime',
            offset: 0,
            top: '-57%',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }],
        yAxis: [{
            title: {
                text: 'Height above bottom [m]',
                style: {
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} m',
                style: {
                    fontSize: '1rem'
                }
            },
            reversed: false,
            min: 0,
            max: 15,
            height: '45%',
            offset: 0,
        }, {
            title: {
                text: 'Height above bottom [m]',
                style: {
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value} m',
                style: {
                    fontSize: '1rem'
                }
            },
            reversed: false,
            min: 0,
            max: 15,
            height: '45%',
            offset: 0,
            top: '57%',
            
        }],
        colorAxis: [{ // temperature
            stops: [
                [0, '#183067'], // darker blue
                [0.1, '#3060cf'],
                [0.5, '#fffbbc'], // yellow
                [0.9, '#c4463a'],
                [1, '#62231d'] // darker red
            ],
            min: 7,
            max: 28,
            startOnTick: false,
            endOnTick: false,
            layout: 'vertical',
            labels: {
                format: '{value}°C',
                style: {
                    fontSize: '1rem'
                }
            },
            reversed: false
        }, { // dissolved oxygen
            stops: [
                [0, '#c4463a'],
                [0.1, '#c4463a'],
                [0.5, '#fffbbc'],
                [1, '#3060cf']
            ],
            min: 0,
            max: 12,
            layout: 'vertical',
            labels: {
                format: '{value} mg/L',
                style: {
                    fontSize: '1rem'
                }
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
            width: 110,
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
                headerFormat:'<b style="font-size: 1rem">Temperature</b><br/>',
                pointFormat: '<span style="font-size: 1rem">{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}°C</span>'
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
                headerFormat:'<b style="font-size: 1rem">Dissolved Oxygen</b><br/>',
                pointFormat: '<span style="font-size: 1rem">{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}mg/L</span>'
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
                headerFormat:'<b style="font-size:1rem">Maximum Depth</b><br/>',
                pointFormat: '<span style="font-size:1rem">{point.x:%Y-%m-%d %H:%M}, {point.y}m</span>'
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
                symbol: 'circle',
            },
            tooltip: {
                headerFormat:'<b style="font-size:1rem">Instrument Location</b><br/>',
                pointFormat: '<span style="font-size:1rem">{point.y}m</span>'
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
                symbol: 'circle',
            },
            tooltip: {
                headerFormat:'<b style="font-size:1rem">Instrument Location</b><br/>',
                pointFormat: '<style="font-size:1rem">{point.y}m</span>'
            },
        }],
        updateTime: {
            setTime: 0,
            endTime: 0
        }
    })
    var today = new Date();
    var lastYear = new Date(today.getFullYear(), today.getMonth(), today.getDate()-365);
    const [startDate, setStartDate] = useState(lastYear);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastYear);
    const [endGraphDate, setGraphEndDate] = useState(today);
    const [oxygenDataArr,setOxygenDataArr] = useState([])
    const [tempDataArr,setTempDataArr] = useState([])
    const [isLoading,setIsLoading] = useState(true)

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
    const lakeOxygen = useFetch('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen')

    const lakeTemp = useFetch('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature')
    
    function getFilteredData(data, dataType, isInstrument = false) {
        let m = []
        if (isInstrument && data.length != 0) {
            Object.keys(data[0]).forEach(key => {
                let pstTime = convertGMTtoPSTTime(new Date(data[0].DateTime_UTC));
                let re = /^Height_([^m]*)m$/;
                // console.log(re.exec(key))
                if (re.exec(key) !== null) {
                    m.push([pstTime.getTime(),parseFloat(re.exec(key)[1])])
                }
            })
            if (dataType == "temp") {
                let pstTime = convertGMTtoPSTTime(new Date(data[0].DateTime_UTC));
                m.push([pstTime.getTime(),parseFloat(data[0].Height_max)])
            }
            return m
        }
        if (dataType == "depth") {
            data.forEach((element => {
                let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
                m.push([pstTime.getTime(), parseFloat(element["Height_max"])])
            }))
        } else if (dataType == "oxy") {
            data.forEach((element => {
                let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
                //start data
                let s = 0.5;

                let i = s;

                //end data
                let e = -1;

                let stri = "Height_0.5m";
                m.push([pstTime.getTime(),s, parseFloat(element["Height_0.5m"])]);
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
                            m.push([pstTime.getTime(),val, Math.round(values*100)/100]);
                        }
                        m.push([pstTime.getTime(),Math.round(e*100)/100, parseFloat(element[ending])]);
                        stri = ending;
                        s = e;
                        e = -1;
                    }
                    i += 0.01;
                }

            }))
        } else if (dataType == "temp") {
            data.forEach((element => {
                let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
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
                        m.push([pstTime.getTime(),s,parseFloat(element[stri])]);

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
                            m.push([pstTime.getTime(),Math.round(j*100)/100, Math.round(values*100)/100]);
                        }
                        s = e;
                        stri = ending;
                        e = -1;

                    }
                    i += 0.01;
                }
                m.push([pstTime.getTime(),s,parseFloat(element[stri])]);
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
                    m.push([pstTime.getTime(),Math.round(j*100)/100, Math.round(values*100)/100]);
                }
                m.push([pstTime.getTime(),heightMax,parseFloat(element["Height_surface"])]);
            }))
        }
        
        m.sort(function(a,b) {
            return (a[0]-b[0])
        })
        return m
    }
    useEffect(() => {
        setOxygenDataArr([])
        setTempDataArr([])

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime()
        let diffDay = diffTime/(1000*3600*24)

        let oxygenFetch =[]
        let tempFetch = []
        
        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 366) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 366));

            diffTime = endGraphDate.getTime() - newDay.getTime()
            diffDay = diffTime/(1000*3600*24)

            oxygenFetch.push(lakeOxygen.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`))
            tempFetch.push(lakeTemp.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`))

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 366));
            compareDate = newDayPlusOne

        }

        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        oxygenFetch.push(lakeOxygen.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`))
        tempFetch.push(lakeTemp.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`))
        setIsLoading(true); // Loading is true

        async function fetchData() {
            oxygenFetch = await Promise.all(oxygenFetch)
            tempFetch = await Promise.all(tempFetch)

            let combinedOxygenData = [].concat.apply([],oxygenFetch)
            let combinedTempData = [].concat.apply([],tempFetch)

            setOxygenDataArr(combinedOxygenData)
            setTempDataArr(combinedTempData)
            setIsLoading(false)
        }
        fetchData()

    },[startGraphDate,endGraphDate])
    useEffect(() => {
        if (!isLoading) {
            
            let oxyFiltered = getFilteredData(oxygenDataArr, "oxy");
            let tempFiltered = getFilteredData(tempDataArr, "temp");
            
            if (oxyFiltered.length != 0) {
                var minX = oxyFiltered[0][0];
                var maxX = oxyFiltered[oxyFiltered.length-1][0]
            }
            let depthFiltered = getFilteredData(oxygenDataArr, "depth");
            let oxyInstrument = getFilteredData(oxygenDataArr, "oxy", true);
            let tempInstrument = getFilteredData(tempDataArr, 'temp', true)
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
    },[isLoading])

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
            <Chart chartProps={chartProps} isLoading={isLoading} />
        </div>
        
    )
}


