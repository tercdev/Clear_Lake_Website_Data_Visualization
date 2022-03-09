import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useFetch from 'react-fetch-hook'
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
            
        }, 
        {
            name: 'Flow',
            data: [],
            selected: true,
            yAxis: 1,
            color: Highcharts.getOptions().colors[0],
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
    // if (dataType == "Turb_BES") {
    //     var data = cleanTurbMeanData(data,dataType)
    // }
    data.forEach((element => {
        //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));

        m.push([new Date(element.TmStamp).getTime(), parseFloat(element[dataType])]);
    }));
    return m;
}

export default function StreamChart({
    fromDate,
    endDate,
    id
}) {

  const chartComponent = useRef(null); 
  const [chartOptions, setChartOptions] = useState({
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
            
        }, 
        {
            name: 'Flow',
            data: [],
            selected: true,
            yAxis: 1,
            color: Highcharts.getOptions().colors[0],
        },
         
    ],
    updateTime: {
        setTime: 0,
        endTime: 0,
    }
  })
  var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
  var search_params = url.searchParams;
  search_params.set('id',id);
  search_params.set('rptdate',fromDate);
  search_params.set('rptend',endDate);
  url.search = search_params.toString();

  var new_url = url.toString();
  const {isLoading,data} = useFetch(new_url);

  useEffect(()=> {
    console.log(isLoading)
    if (!isLoading) {
        var turbData = getFilteredData(data,"Turb_BES")
        console.log(turbData)
        setChartOptions(()=> ({
            series: [
                {
                    data: turbData
                }
            ]
        }))
    }
  },[isLoading])

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
