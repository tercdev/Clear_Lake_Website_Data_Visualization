import React, { useEffect, useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

export default function StreamChart({
    chartProps,
    isLoading
}) {

    const chartComponent = useRef(null); 
    const chart = chartComponent.current?.chart;
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
