import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useFetch from 'react-fetch-hook'
import HighchartsExportMenu from './HighchartsExportMenu.js'
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/export-data')(Highcharts)
// require('highcharts/indicators/indicators')(Highcharts)
// require('highcharts/indicators/pivot-points')(Highcharts)
// require('highcharts/indicators/macd')(Highcharts)

const options = {
    chart: {
        zoomType: 'x',
        height: 700,
    },
    subtitle: {
        text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
    },
    title: {
        text: 'Turbity Mean and Flow Chart'
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
            text: 'Turbity [NTU]',
            style: {
                color: Highcharts.getOptions().colors[3]
            }
        },
        opposite: true,
        height: '50%',
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
        height: '50%',
        top: '50%',
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
            name: 'Turbity',
            data: [],
            selected: true,
            yAxis: 0,
            color: Highcharts.getOptions().colors[3],
            redraw: true,
            
        }, 
        {
            name: 'Flow',
            data: [],
            selected: true,
            yAxis: 1,
            color: Highcharts.getOptions().colors[0],
            redraw: true,
        },
         
    ],
    updateTime: {
        setTime: 0,
        endTime: 0,
    }
  };

  // get data based on graph type
function getFilteredData(data, dataType) {
    let m = [];
    // console.log(data)
    // console.log(typeof(data))
    // console.log("datatype:",dataType)
    if (dataType == "Flow") {
        //var data = cleanTurbMeanData(data,dataType)
        console.log("flow data")
        data.forEach((element => {
            //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
    
            m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element[dataType])]);
        }));
    }
    else {
        // console.log(data)
        // console.log(typeof(data))
        // data = JSON.parse(JSON.stringify(data));
        data.forEach((element => {
        //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));

        m.push([new Date(element.TmStamp).getTime(), parseFloat(element[dataType])]);
    }));
}
    console.log(m)
    return m.reverse();
}

function convertDate(date) {
    let year = date.getFullYear().toString();
    let month = (date.getMonth()+1).toString();
    let day = date.getDate().toString();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return year+month+day;
}

export default function StreamChart({
    fromDate,
    endDate,
    id,
    dataType,
    dataType2 = null,
    chartProps
}) {

  const chartComponent = useRef(null); 
  const [chartOptions, setChartOptions] = useState(chartProps)
  var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
  var flowurl = new URL('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams')

  var search_params_flow = flowurl.searchParams;
  search_params_flow.set('id',id);
  search_params_flow.set('start',convertDate(fromDate));
  search_params_flow.set('end',convertDate(endDate));
  flowurl.search = search_params_flow.toString();
//   console.log(flowurl)
  var flow_new_url = flowurl.toString();
//   console.log(flow_new_url)
  
  const flowData = useFetch(flow_new_url);

  var search_params = url.searchParams;
  search_params.set('id',id);
  search_params.set('rptdate',convertDate(fromDate));
  search_params.set('rptend',convertDate(endDate));
  url.search = search_params.toString();

  var new_url = url.toString();
  const creekData = useFetch(new_url);

  useEffect(()=> {

    if ( !creekData.isLoading) {
        var filteredData = getFilteredData(creekData.data,dataType)
        if (dataType2) {
            if (!flowData.isLoading){
                var filteredData2 = getFilteredData(flowData.data,dataType2)
                setChartOptions(()=> ({
                    series: [
                        {
                            data: filteredData
                        },
                        {
                            data: filteredData2
                        }
                    ]
                }))
            }
        }
        else {
            setChartOptions(()=> ({
                series: [
                    {
                        data: filteredData
                    }
                ]
            }))
        }

     }
  },[creekData.isLoading])

  return (
    <div>
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={true}
            options={chartOptions}  />
    </div>
  )
}
