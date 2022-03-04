import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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

export default function StreamChart() {

    async function updateData(id,rptdate,rptend) {
        this.chart.showLoading();
        let turbData = await asyncGetData(id,rptdate,rptend,"Turb_BES");
        //let flowData = await asyncGetData(id,rptdate,rptend,"");           
        this.chart.hideLoading();
        this.chart.series[0].setData(turbData);
        //this.chart.series[1].setData(flowData);
                
    }
    useEffect(() => {
        updateData(1, lastWeekDate, currentTime);
    })
    
    
  return (
    <div>
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={this.allowChartUpdate}
            options={chartOptions}  />
    </div>
  )
}
