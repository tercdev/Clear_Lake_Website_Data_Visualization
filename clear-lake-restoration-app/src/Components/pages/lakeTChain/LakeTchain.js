import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import Chart from '../../Chart';
import DatePicker from 'react-datepicker';
import CollapsibleItem from '../../CollapsibleItem';
import '../../DateRangePicker.css';
import useFetch from 'use-http';
import { 
    convertDate,
    convertGMTtoPSTTime, 
    isAllEmpty,
    dateToDateTime
} from '../../utils';

require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/boost')(Highcharts);

/**
 * Component for showing one site's lake mooring page.  
 * @param {String} id used in API call for a specific site
 * @param {String} name Title of the page
 * @returns {JSX.Element} 
 */
export default function LakeTchain(props) {
    /**
     * Temperature color axis label text
     */
    var templabel;
    /**
     * Dissolved oxygen color axis label text
     */
    var dolabel;

    /**
     * Add Color Axis Legend Labels
     * @param {Object} chart
     * @param {number} top number of pixels down from the top of the chart for the temperature label (top color axis)
     * @param {number} bottom number of pixels down from the top of the chart for the dissolved oxygen label (bottom color axis)
     */
    function createLegendLabels(chart, top, bottom) {
        // destroy previous labels
        if (typeof templabel !== 'undefined') {
            templabel.destroy();
            templabel = undefined;
            dolabel.destroy();
            dolabel = undefined;
        }
        // add new labels to the chart
        templabel = chart.renderer.text('Temperature [°C]', chart.chartWidth-30, top)
        .attr({
            rotation: 90
        })
        .css({
            fontSize: '1rem'
        })
        .add();
        dolabel = chart.renderer.text('Dissolved Oxygen [mg/L]', chart.chartWidth-30, bottom)
        .attr({
            rotation: 90
        })
        .css({
            fontSize: '1rem'
        })
        .add();
    }
    /**
     * Initial state of all the chart properties.  
     * https://www.highcharts.com/demo/heatmap-canvas
     */
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            type: 'heatmap',
            height: 700,
            time: {
                useUTC: false
            },
            events: {
                load() { // show Loading... text and add legend labels
                    this.showLoading();
                    createLegendLabels(this, 150, 450);
                },
                render() { // rerender legend labels
                    createLegendLabels(this, 150, 450);
                }
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>White Dots represent depth of the loggers. Black line is the depth of the water column.',
            style: {
                fontSize: '1rem'
            }
        },
        credits: {
            enabled: false
        },
        boost: {
            useGPUTranslations: true
        },
        xAxis: [{ // for dissolved oxygen (bottom) chart
            type: 'datetime',
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }, { // for temperature (top) chart
            type: 'datetime',
            offset: 0,
            top: '-57%', // moves entire x axis up and down
            labels: {
                style: {
                    fontSize: '1rem'
                }
            }
        }],
        yAxis: [{ // for temperature (top) chart
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
            min: 0, // min y value
            max: 15, // max y value
            height: '45%', // height of the y axis
            offset: 0,
        }, { // for dissolved oxygen (bottom) chart
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
            min: 0, // min y value
            max: 15, // max y value
            height: '45%', // heiht of the y axis
            offset: 0,
            top: '57%', // moves the entire y axis up and down
        }],
        colorAxis: [{ // temperature
            stops: [
                [0, '#183067'], // darker blue
                [0.1, '#3060cf'], // blue
                [0.5, '#fffbbc'], // yellow
                [0.9, '#c4463a'], // red
                [1, '#62231d'] // darker red
            ],
            min: 7, // min temperature
            max: 28, // max temperature
            startOnTick: false, // start from specified min
            endOnTick: false, // end at specified max
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
            min: 0, // min dissolved oxygen
            max: 12, // max dissolved oxygen
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
            itemMarginTop: 39, // increase moves bottom color axis down
            itemMarginBottom: 37, // increase moves top color axis up
            width: 110,
            y: 30, // number of pixels down from the top
            symbolHeight: 240, // height of color axis
            navigation: {
                enabled: false // removes pagination
            }
        },
        responsive: { // change the color axis size and location, location of the labels as the size of the window changes
            rules: [{
                condition: {
                    maxWidth: 600
                },
                chartOptions: {
                    legend: {
                        symbolHeight: 220,
                        y: 50,
                        itemMarginBottom: 35,
                        itemMarginTop: 40
                    },
                    chart: {
                        events: {
                            render() {
                                createLegendLabels(this, 180, 455)
                            }
                        }
                    }
                }
            }, {
                condition: {
                    maxWidth: 375
                },
                chartOptions: {
                    legend: {
                        symbolHeight: 200,
                        y: 60,
                        itemMarginBottom: 15,
                        itemMarginTop: 50
                    },
                    chart: {
                        events: {
                            render() {
                                createLegendLabels(this, 215, 465)
                            }
                        }
                    }
                }
            }, ]
        },
        series: [{
            name: 'Temperature',
            data: [],
            type: 'heatmap',
            boostThreshold: 100,
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 36e5, // 1 hour
            tooltip: {
                valueDecimals: 2,
                headerFormat:'<b style="font-size: 1rem">Temperature</b><br/>',
                pointFormat: '<span style="font-size: 1rem">{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}°C</span>'
            },
        }, {
            name: 'Dissolved Oxygen',
            data: [],
            type: 'heatmap',
            boostThreshold: 100,
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 36e5, // 1 hour
            tooltip: {
                valueDecimals: 2,
                headerFormat:'<b style="font-size: 1rem">Dissolved Oxygen</b><br/>',
                pointFormat: '<span style="font-size: 1rem">{point.x:%Y-%m-%d %H:%M}, {point.y}m, {point.value}mg/L</span>'
            },
            yAxis: 1,
            colorAxis: 1
        }, {
            name: 'Maximum Depth',
            data: [],
            type: 'line',
            yAxis: 1, // goes on the dissolved oxygen chart
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
            yAxis: 0, // goes on the temperature chart
            colorAxis: 0,
            color: Highcharts.getOptions().colors[0],
            marker: {
                fillColor: '#fff', // white
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
            yAxis: 1, // goes on the dissolved oxygen chart
            colorAxis: 1,
            color: Highcharts.getOptions().colors[0],
            marker: {
                fillColor: '#fff', // white
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
    });

    // for the date range picker and dates displayed on the graph
    // initial start date is 1 year ago 
    // initial end date is today
    var today = new Date();
    var lastYear = new Date(today.getFullYear(), today.getMonth(), today.getDate()-365);
    const [startDate, setStartDate] = useState(lastYear);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastYear);
    const [endGraphDate, setGraphEndDate] = useState(today);

    // hooks for data array changes
    const [oxygenDataArr,setOxygenDataArr] = useState([]);
    const [tempDataArr,setTempDataArr] = useState([]);

    // hooks for if graph is loading
    const [isLoading,setIsLoading] = useState(true);

    // hooks for if data is empty
    const [isEmpty,setIsEmpty] = useState(true);

    // when the user changes the date, the date selector updates the date
    function handleStartDateChange(e) {
        setStartDate(e);
    }
    function handleEndDateChange(e) {
        setEndDate(e);
    }

    // set the graph's start and end date
    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
    }

    // fetching data using API endpoints
    const lakeOxygen = useFetch('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen');
    const lakeTemp = useFetch('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature');
    
    /**
     * Given a data array, return an array of [time, y, value] or [time, y] to be used for graphing
     * @param {Array} data 
     * @param {String} dataType "temp", "oxy", "depth"
     * @param {boolean} isInstrument whether to return the instrument locations or not; false by default
     * @returns {Array} Array of arrays for graphing
     */
    function getFilteredData(data, dataType, isInstrument = false) {
        let m = [];

        if (isInstrument && data.length != 0) { // return instrument location for the leftmost x value (oldest time)
            // Use regex to extract the depth of the instrument from the keys which look like Height_0.5m, Height_1m, etc
            // then add the depth to the array
            Object.keys(data[0]).forEach(key => {
                let newDate = dateToDateTime(data[0].DateTime_UTC)
                let pstTime = convertGMTtoPSTTime(newDate);

                let re = /^Height_([^m]*)m$/;
                if (re.exec(key) !== null) {
                    m.push([pstTime.getTime(),parseFloat(re.exec(key)[1])]);
                }
            });
            if (dataType == "temp") { // add the instrument at the surface
                let newDate = dateToDateTime(data[0].DateTime_UTC)
                let pstTime = convertGMTtoPSTTime(newDate);

                m.push([pstTime.getTime(),parseFloat(data[0].Height_max)]);
            }
            return m;
        }

        if (dataType == "depth") { // return the maximum height of the water column at each time
            data.forEach((element => {
                let newDate = dateToDateTime(element.DateTime_UTC)

                let pstTime = convertGMTtoPSTTime(newDate);

                m.push([pstTime.getTime(), parseFloat(element["Height_max"])]);
            }))
        } else if (dataType == "oxy") {
            data.forEach((element => {
                let newDate = dateToDateTime(element.DateTime_UTC)

                let pstTime = convertGMTtoPSTTime(newDate);
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

            }));
        } else if (dataType == "temp") {
            data.forEach((element => {
                let newDate = dateToDateTime(element.DateTime_UTC)

                let pstTime = convertGMTtoPSTTime(newDate);

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

                        // console.log("Start: " + s);
                        // console.log("End: " + e);
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
            }));
        }
        // sort by date
        m.sort(function(a,b) {
            return (a[0]-b[0]);
        })
        return m;
    }

    useEffect(() => {
        console.log("hello")
        setOxygenDataArr([])
        setTempDataArr([])

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime();
        let diffDay = diffTime/(1000*3600*24);

        let oxygenFetch =[];
        let tempFetch = [];
        
        let newDay = 0;
        let compareDate = startGraphDate;

        while (diffDay > 366) {
            newDay = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 366));

            diffTime = endGraphDate.getTime() - newDay.getTime();
            diffDay = diffTime/(1000*3600*24);

            oxygenFetch.push(lakeOxygen.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));
            tempFetch.push(lakeTemp.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(newDay)}`));

            // next query should be the last day +1 so no overlap with data
            let newDayPlusOne = new Date(new Date(compareDate.getTime()).setDate(compareDate.getDate() + 366));
            console.log("new day plus one",newDayPlusOne)
            compareDate = newDayPlusOne;

        }

        // query one extra day since data retrieved is in UTC
        let endDayPlusOne = new Date(new Date(endGraphDate.getTime()).setDate(endGraphDate.getDate() + 1));

        oxygenFetch.push(lakeOxygen.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`));
        tempFetch.push(lakeTemp.get(`?id=${props.id}&start=${convertDate(compareDate)}&end=${convertDate(endDayPlusOne)}`));
        setIsLoading(true); // Loading is true

        async function fetchData() {
            oxygenFetch = await Promise.all(oxygenFetch);
            tempFetch = await Promise.all(tempFetch);
            if (isAllEmpty(oxygenFetch) && isAllEmpty(tempFetch)) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

            let combinedOxygenData = [].concat.apply([],oxygenFetch);
            let combinedTempData = [].concat.apply([],tempFetch);
            
            console.log(combinedOxygenData
                )
            setOxygenDataArr(combinedOxygenData);
            setTempDataArr(combinedTempData);
            setIsLoading(false);
        }
        fetchData();

    },[startGraphDate,endGraphDate]);

    useEffect(() => {
        if (!isLoading) {
            // update chart properties with data
            let oxyFiltered = getFilteredData(oxygenDataArr, "oxy");
            let tempFiltered = getFilteredData(tempDataArr, "temp");
            
            if (oxyFiltered.length != 0) { // first and last date as min and max x axis values
                var minX = oxyFiltered[0][0];
                var maxX = oxyFiltered[oxyFiltered.length-1][0];
            }
            let depthFiltered = getFilteredData(oxygenDataArr, "depth");
            let oxyInstrument = getFilteredData(oxygenDataArr, "oxy", true);
            let tempInstrument = getFilteredData(tempDataArr, 'temp', true);
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
            });
        }
    },[isLoading])

    // for the collapsible FAQ
    const content = [
        {   
            id: "1",
            header: "How to use the graphs and see the data below?",
            content: <ol>
                <li>Select start and end dates. Local time is in PST.</li>
                <li>Click submit to update the graphs below.</li>
                <li>Graph and data loading will depend on the length of the selected time period. For example, longer time periods will result to longer loading times.</li>
                <p>*Note: The white dots on the left side of the charts represent depth of the loggers. The black line on the Dissolved Oxygen graph represents the depth of the water column.</p>
            </ol>
        }, {
            id: "2",
            header: "Why is no data showing up on my plots?",
            content: <p>If there is no data, check <a href="https://clearlakerestoration.sf.ucdavis.edu/metadata">here</a> to read more about the metadata.</p>
        }
    ];

    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer/>
            <div className="collapsible-container">
                <CollapsibleItem header={content[0].header} content={content[0].content}/>
                <CollapsibleItem header={content[1].header} content={content[1].content}/>
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
            <Chart chartProps={chartProps} isLoading={isLoading} isEmpty={isEmpty}/>
        </div>
    )
}


