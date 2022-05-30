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
            templabel = undefined
            dolabel.destroy();
            dolabel = undefined
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
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>White Dots represent depth of the loggers. Black line is the depth of the water column',
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
    })

    // for the date range picker and dates displayed on the graph
    // initial start date is 1 year ago 
    // initial end date is today
    var today = new Date();
    var lastYear = new Date(today.getFullYear(), today.getMonth(), today.getDate()-365);
    const [startDate, setStartDate] = useState(lastYear);
    const [endDate, setEndDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(lastYear);
    const [endGraphDate, setGraphEndDate] = useState(today);

    const [oxygenDataArr,setOxygenDataArr] = useState([])
    const [tempDataArr,setTempDataArr] = useState([])
    const [isLoading,setIsLoading] = useState(true)

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

    const lakeOxygen = useFetch('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen')

    const lakeTemp = useFetch('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature')
    
    /**
     * Given a data array, return an array of [time, y, value] or [time, y] to be used for graphing
     * @param {Array} data 
     * @param {String} dataType "temp", "oxy", "depth"
     * @param {boolean} isInstrument whether to return the instrument locations or not; false by default
     * @returns {Array} Array of arrays for graphing
     */
    function getFilteredData(data, dataType, isInstrument = false) {
        let m = []
        if (isInstrument && data.length != 0) { // return instrument location for the leftmost x value (oldest time)
            // Use regex to extract the depth of the instrument from the keys which look like Height_0.5m, Height_1m, etc
            // then add the depth to the array
            Object.keys(data[0]).forEach(key => {
                let pstTime = convertGMTtoPSTTime(new Date(data[0].DateTime_UTC));
                let re = /^Height_([^m]*)m$/;
                if (re.exec(key) !== null) {
                    m.push([pstTime.getTime(),parseFloat(re.exec(key)[1])])
                }
            })
            if (dataType == "temp") { // add the instrument at the surface
                let pstTime = convertGMTtoPSTTime(new Date(data[0].DateTime_UTC));
                m.push([pstTime.getTime(),parseFloat(data[0].Height_max)])
            }
            return m
        }
        if (dataType == "depth") { // return the maximum height of the water column at each time
            data.forEach((element => {
                let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
                m.push([pstTime.getTime(), parseFloat(element["Height_max"])])
            }))
        } else if (dataType == "oxy") {
            data.forEach((element => {
                let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
                m.push([pstTime.getTime(),0.5, parseFloat(element["Height_0.5m"])]);
                let val1m = (((1-0.5)/(2-0.5)) * (parseFloat(element["Height_2m"]) - parseFloat(element["Height_0.5m"])) + parseFloat(element["Height_0.5m"]));
                m.push([pstTime.getTime(),1, val1m]);
                m.push([pstTime.getTime(),2, parseFloat(element["Height_2m"])]);
                let val3m = (((3-2)/(6-2)) * (parseFloat(element["Height_6m"]) - parseFloat(element["Height_2m"])) + parseFloat(element["Height_2m"]));
                m.push([pstTime.getTime(),3, val3m]);
                let val4m = (((4-2)/(6-2)) * (parseFloat(element["Height_6m"]) - parseFloat(element["Height_2m"])) + parseFloat(element["Height_2m"]));
                m.push([pstTime.getTime(),4, val4m]);
                let val5m = (((5-2)/(6-2)) * (parseFloat(element["Height_6m"]) - parseFloat(element["Height_2m"])) + parseFloat(element["Height_2m"]));
                m.push([pstTime.getTime(),5, val5m]);
                m.push([pstTime.getTime(),6, parseFloat(element["Height_6m"])]);
            }))
        } else if (dataType == "temp") {
            data.forEach((element => {
                let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
                let h = -1;
                m.push([pstTime.getTime(),0.5,parseFloat(element["Height_0.5m"])]);
                m.push([pstTime.getTime(),1,parseFloat(element["Height_1m"])]);
                m.push([pstTime.getTime(),2,parseFloat(element["Height_2m"])]);
                m.push([pstTime.getTime(),3,parseFloat(element["Height_3m"])]);
                m.push([pstTime.getTime(),4,parseFloat(element["Height_4m"])]);
                if (element["Height_5m"] == null) {
                    h = 5;
                } else if (element["Height_6m"] == null) {
                    h = 6;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                } else if (element["Height_7m"] == null) {
                    h = 7;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([pstTime.getTime(),6,parseFloat(element["Height_6m"])]);
                } else if (element["Height_8m"] == null) {
                    h = 8;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([pstTime.getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([pstTime.getTime(),7,parseFloat(element["Height_7m"])]);
                } else if (element["Height_9m"] == null) {
                    h = 9;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([pstTime.getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([pstTime.getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([pstTime.getTime(),8,parseFloat(element["Height_8m"])]);
                } else if (element["Height_10m"] == null) {
                    h = 10;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([pstTime.getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([pstTime.getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([pstTime.getTime(),8,parseFloat(element["Height_8m"])]);
                    m.push([pstTime.getTime(),9,parseFloat(element["Height_9m"])]);
                } else if (element["Height_11m"] == null) {
                    h = 11;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([pstTime.getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([pstTime.getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([pstTime.getTime(),8,parseFloat(element["Height_8m"])]);
                    m.push([pstTime.getTime(),9,parseFloat(element["Height_9m"])]);
                    m.push([pstTime.getTime(),10,parseFloat(element["Height_10m"])]);
                } else {
                    h = 12;
                    m.push([pstTime.getTime(),5,parseFloat(element["Height_5m"])]);
                    m.push([pstTime.getTime(),6,parseFloat(element["Height_6m"])]);
                    m.push([pstTime.getTime(),7,parseFloat(element["Height_7m"])]);
                    m.push([pstTime.getTime(),8,parseFloat(element["Height_8m"])]);
                    m.push([pstTime.getTime(),9,parseFloat(element["Height_9m"])]);
                    m.push([pstTime.getTime(),10,parseFloat(element["Height_10m"])]);
                    m.push([pstTime.getTime(),11,parseFloat(element["Height_11m"])]);
                }

                let heightM = parseFloat(element["Height_max"]);
                let heightMWhole = Math.floor(parseFloat(element["Height_max"]));
                for (let j = h; j <= heightMWhole; j++) {
                    let strVal = "Height_" + (h-1) + "m";
                    let values =  (((j-(h-1))/(heightM-(h-1))) * (parseFloat(element["Height_surface"]) - parseFloat(element[strVal])) + parseFloat(element[strVal]));
                    m.push([pstTime.getTime(),j,values]);
                }
                m.push([pstTime.getTime(),parseFloat(element["Height_max"]),parseFloat(element["Height_surface"])]);
                h = -1;
            }))
        }
        // sort by date
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
            // update chart properties with data
            let oxyFiltered = getFilteredData(oxygenDataArr, "oxy");
            let tempFiltered = getFilteredData(tempDataArr, "temp");
            
            if (oxyFiltered.length != 0) { // first and last date as min and max x axis values
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
