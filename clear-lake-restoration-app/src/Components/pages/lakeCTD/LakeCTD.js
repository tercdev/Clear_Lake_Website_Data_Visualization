import React, { useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';
import Highcharts from 'highcharts';

import Chart from '../../Chart';
import DataDisclaimer from '../../DataDisclaimer';
import SpecificDateSelect from '../../SpecificDateSelect';
import CollapsibleItem from '../../CollapsibleItem';
import { convertDatetoUTC } from '../../utils';

import './LakeCTD.css';

/**
 * Component for showing one site's lake profile page.
 * @param {String} id used in API call for a specific site
 * @param {String} name Title of the page 
 * @returns {JSX.Element}
 */
export default function LakeCTD(props) {
    /**
     * Given a data array, return an array of [depth, y] to be used for graphing
     * @param {Array} data 
     * @param {String} dataType 'Chla', 'SpeCond', 'Temp', 'Turb', 'DO'
     * @returns {Array} Array of arrays for graphing
     */
    function getFilteredData(data, dataType) {
        let m = [];
        data.forEach((element => {
            if (parseFloat(element[dataType]) >= 0) { // remove negative values
                m.push([parseFloat(element.Depth), parseFloat(element[dataType])]);
            }
        }));

        // sort by date
        m.sort(function(a,b) {
            return (a[0]-b[0]);
        });

        // remove duplicate entries in m
        /**
         * Array of unique entries depth,y as strings
         */
        let uniq = [];
        /**
         * Array of arrays [depth, y] where each entry is unique
         */
        let b = m.filter(function (v) {
            if (uniq.indexOf(v.toString()) < 0) {
                uniq.push(v.toString());
                return v;
            }
        })
        return b;
    }

    /**
     * Initial state of all the chart properties.  
     * Note: x axis is the vertical axis and y axes are the horizontal axes
     */
    const [chartProps, setChartProps] = useState({
        chart: {
            zoomType: 'x',
            type: 'spline', // for smooth lines
            inverted: true, // swap x and y axis
            height: 1200
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Click and drag in the plot area to zoom in.<br/>Use three-line icon on top right to download the data displayed in the graph.<br/>Click on the name of the series in the legend on the bottom to hide / show the series on the graph.',
            style: {
                fontSize: '1rem'
            }
        },
        credits: {
            enabled: false,
        },
        xAxis: [{
            reversed: false,
            title: {
                enabled: true,
                text: 'Depth [m]',
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
            max: 0,
            gridLineWidth: 1 // show horizontal grid lines
        }],
        yAxis: [{
            title: {
                text: 'Chlorophyll [µg/l]',
                style: {
                    color: Highcharts.getOptions().colors[7],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[7],
                    fontSize: '1rem'
                },
                step: 2 // every other grid line has a label
            },
            lineColor: Highcharts.getOptions().colors[7],
            lineWidth: 5,
            opposite: true, // axis on top
            showLastLabel: true,
            min: 0, // min chlorophyll
            max: 32, // max chlorophyll
            startOnTick: false, // start from specified min
            endOnTick: false, // end at specified max
        }, {
            title: {
                text: 'Dissolved Oxygen [mg/l]',
                style: {
                    color: Highcharts.getOptions().colors[0],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0],
                    fontSize: '1rem'
                },
                step: 2 // every other grid line has a label
            },
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 5,
            opposite: true, // axis on top
            showLastLabel: true,
            min: 0, // min dissolved oxygen
            max: 16, // max dissolved oxygen
            startOnTick: false, // start from specified min
            endOnTick: false, // end at specified max
            gridLineWidth: 0 // hide grid line
        }, {
            title: {
                text: 'Specific Conductivity [µS/cm]',
                style: {
                    color: Highcharts.getOptions().colors[5],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[5],
                    fontSize: '1rem'
                },
                step: 2 // every other grid line has a label
            },
            lineColor: Highcharts.getOptions().colors[5],
            lineWidth: 5,
            showLastLabel: true,
            min: 180, // min specific conductivity
            max: 410, // max specific conductivity
            startOnTick: false, // start from specified min
            endOnTick: false, // end at specified max
            gridLineWidth: 0 // hide grid line
        }, {
            title: {
                text: 'Temperature [°C]',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[3],
                    fontSize: '1rem'
                },
                step: 2 // every other grid line has a label
            },
            lineColor: Highcharts.getOptions().colors[3],
            lineWidth: 5,
            showLastLabel: true,
            min: 4, // min temperature
            max: 28, // max temperature
            startOnTick: false, // start from specified min
            endOnTick: false, // end at specified max
            gridLineWidth: 0 // hide grid line
        }, {
            title: {
                text: 'Turbidity [FTU]',
                style: {
                    color: Highcharts.getOptions().colors[4],
                    fontSize: '1rem'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[4],
                    fontSize: '1rem'
                },
                step: 2 // every other grid line has a label
            },
            lineColor: Highcharts.getOptions().colors[4],
            lineWidth: 5,
            showLastLabel: true,
            min: 0, // min turbidity
            max: 80, // max turbidity
            startOnTick: false, // start from specified min
            endOnTick: false, // end at specified max
            gridLineWidth: 0 // hide grid line
        }],
        tooltip: {
            formatter: function() {
                /**
                 * Object that assigns each series a corresponding unit to be shown in the tooltip.  
                 * `series_name`: `unit`
                 */
                let units = {
                    "Chlorophyll": "µg/l",
                    "Dissolved Oxygen": 'mg/l',
                    "Specific Conductivity": 'µS/cm',
                    "Temperature": '°C',
                    "Turbidity": 'FTU'
                }
                return this.points.reduce(function (s, point) {
                    return s + '<br/>' + point.series.name + ': ' +
                        point.y + ' ' + units[point.series.name];
                }, '<b>' + this.x + ' m</b>');
            },
            shared: true,
            followPointer: true,
            style: {
                fontSize: '1rem'
            }
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
                    enable: false // hides markers (only shown on hover)
                }
            }
        },
        legend: {
            verticalAlign: 'top', // puts legend at the top
            itemStyle: {
                fontSize: '1rem'
            }
        },
        updateTime: {
            setTime: 0,
            endTime: 0,
        }
    });
    
    // set all initial dates to today
    var today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [startGraphDate, setGraphStartDate] = useState(today);
    const [endGraphDate, setGraphEndDate] = useState(today);

    /**
     * Set the start date.
     * @param {Date} e 
     */
    function handleStartDateChange(e) {
        if (typeof e !== Date) {
            setStartDate(e);
        }
    }

    /**
     * Set the graph start and end dates which are query parameters for the API call.
     */
    function setGraphDates() {
        setGraphStartDate(startDate);
        setGraphEndDate(startDate);
    }
    
    /**
     * API endpoint for clean profile data
     */
    var url = new URL('https://3kgpak926a.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata');
    /**
     * query parameters: 
     * - `id`: of the site
     * - `start`: date string YYYYMMDD
     * - `end`: date string YYYYMMDD
     */
    var search_params = url.searchParams;
    search_params.set('id',props.id);
    search_params.set('start',convertDatetoUTC(startGraphDate));
    search_params.set('end',convertDatetoUTC(endGraphDate));
    url.search = search_params.toString();
    /**
     * `profileData.isLoading` tells whether data is still being fetched or not    
     * `profileData.data` contains the data  
     * `profileData.error` contains any error message
     */
    const profileData = useFetch(url.toString());
    
    useEffect(() => {
        if (!profileData.isLoading) {
            // update chart properties with data
            let chlaData = getFilteredData(profileData.data, "Chla");
            let doData = getFilteredData(profileData.data, "DO");
            let speCondData = getFilteredData(profileData.data, "SpeCond");
            let tempData = getFilteredData(profileData.data, "Temp");
            let turbData = getFilteredData(profileData.data, "Turb");
            setChartProps({...chartProps,
                series: [
                    {
                        data: chlaData
                    }, {
                        data: doData
                    }, {
                        data: speCondData
                    }, {
                        data: tempData
                    }, {
                        data: turbData
                    }
                ]
            });
        }
    },[profileData.isLoading,startGraphDate])


    /**
     * API endpoint for the distinct dates where the site has profile data
     */
    var dates_url = new URL('https://v35v56rdp6.execute-api.us-west-2.amazonaws.com/default/clearlake-profiledata-sitedates');
    /**
     * query parameters:
     * - `id`: of the site
     */
    var dates_search_params = dates_url.searchParams;
    dates_search_params.set('id', props.id);
    dates_url.search = dates_search_params.toString();
    /**
     * `includedDates.isLoading` tells whether data is still being fetched or not  
     * `includedDates.data` contains the data  
     * `includedDates.error` contains the error message
     */
    const includedDates = useFetch(dates_url.toString());

    // for the collapsible FAQ
    const content = [
        {   
            id: "1",
            header: "How to use the graphs and see the data below?",
            content: <ol>
                <li>Select year, month, and date. Profiles are normally measured between 9 AM and 2 PM, local time (UTC - 8 h).</li>
                <li>Click submit to update the graphs below.</li>
            </ol>
        }
    ];

    return (
        <div>
            <div className='station-page-header'>
                <h1 className='station-page-title'>{props.name}</h1>
            </div>
            <DataDisclaimer />

            <div className="collapsible-container">
                <CollapsibleItem header={content[0].header} content={content[0].content}/>
            </div>

            <div className='date-container profile-graph'>
                <SpecificDateSelect 
                    data={includedDates.data} 
                    isLoading={includedDates.isLoading} 
                    onSelect={handleStartDateChange}
                />
                <button className="submitButton" onClick={setGraphDates}>Submit</button>
            </div>
            <div className='chart-container-half'>
                <Chart chartProps={chartProps} isLoading={profileData.isLoading}/>
            </div>
        </div>
        
    )
}