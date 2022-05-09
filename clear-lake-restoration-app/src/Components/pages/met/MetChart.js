import React, { useRef,useEffect } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function MetChart({
    chartProps,
    isLoading
}) {

  const chartComponent = useRef(null); 
  const chart = chartComponent.current?.chart;
  console.log(chart)
  useEffect(()=> {
    if (chart) {
        chart.showLoading();
        if (!isLoading) {
            chart.hideLoading()
        }
    }


  },[isLoading])

  return (
    <div>
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={true}
            options={chartProps}  />
    </div>
  )
}
