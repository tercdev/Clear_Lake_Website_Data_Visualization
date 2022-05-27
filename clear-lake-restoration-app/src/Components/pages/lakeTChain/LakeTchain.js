import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import DataDisclaimer from '../../DataDisclaimer';
import Chart from '../../Chart';
// import useFetch from 'react-fetch-hook';
import { convertDate } from '../../utils';
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
    const [error, setError] = useState(false);
    function setGraphDates() {
        setError(false);
        let latestDate = new Date(new Date(startDate).setDate(365));
        setGraphStartDate(startDate);
        setGraphEndDate(endDate);
        // }
    }
    const lakeOxygen = useFetch('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen')
    // var oxy_url = new URL('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen');
    // var search_params_oxy = oxy_url.searchParams;
    // search_params_oxy.set('id',props.id);
    // search_params_oxy.set('start',convertDate(startGraphDate));
    // search_params_oxy.set('end',convertDate(endGraphDate));
    // oxy_url.search = search_params_oxy.toString();

    // const oxyData = useFetch(oxy_url.toString());
    const lakeTemp = useFetch('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature')
    // var temp_url = new URL('https://18eduqff9f.execute-api.us-west-2.amazonaws.com/default/clearlake-laketemperature')
    // var search_params_temp = temp_url.searchParams;
    // search_params_temp.set('id',props.id);
    // search_params_temp.set('start',convertDate(startGraphDate));
    // search_params_temp.set('end',convertDate(endGraphDate));
    // temp_url.search = search_params_temp.toString();
    
    // const tempData = useFetch(temp_url.toString());
    function getFilteredData(data, dataType, isInstrument = false) {
        let m = []
        if (isInstrument && data.length != 0) {
            Object.keys(data[0]).forEach(key => {
                let re = /^Height_([^m]*)m$/;
                // console.log(re.exec(key))
                if (re.exec(key) !== null) {
                    m.push([new Date(data[0].DateTime_UTC).getTime(),parseFloat(re.exec(key)[1])])
                }
            })
            if (dataType == "temp") {
                m.push([new Date(data[0].DateTime_UTC).getTime(),parseFloat(data[0].Height_max)])
            }
            return m
        }
        if (dataType == "depth") {
            data.forEach((element => {
                m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element["Height_max"])])
            }))
        } else if (dataType == "oxy") {
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
        setOxygenDataArr([])
        setTempDataArr([])

        // find difference between user picked dates
        let diffTime = endGraphDate.getTime() - startGraphDate.getTime()
        let diffDay = diffTime/(1000*3600*24)
        console.log(diffDay)
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

            console.log("oxygen",oxygenFetch)
            console.log("temp",tempFetch)
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
            // console.log(oxygenDataArr)
            let oxyFiltered = getFilteredData(oxygenDataArr, "oxy");
            // console.log(oxyFiltered)
            // console.log(tempDataArr)
            let tempFiltered = getFilteredData(tempDataArr, "temp");
            if (oxyFiltered.length != 0) {
                var minX = oxyFiltered[0][0];
                var maxX = oxyFiltered[oxyFiltered.length-1][0]
            }
            let depthFiltered = getFilteredData(oxygenDataArr, "depth");
            // console.log(depthFiltered)
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
            {error && <p className='error-message'>Selected date range was more than 365 days. End date was automatically changed.</p>}
            <Chart chartProps={chartProps} isLoading={isLoading} />
        </div>
        
    )
}
