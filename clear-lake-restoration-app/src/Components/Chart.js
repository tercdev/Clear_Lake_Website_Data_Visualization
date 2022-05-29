import React, { useEffect, useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// for the hamburger button in the top right corner of each chart that lets users download different formats of the chart
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

/**
 * Component for showing Highcharts chart
 * @param {Object} chartProps chart properties object
 * @param {boolean} isLoading whether data is still being fetched or not
 * @returns {JSX.Element}
 */
export default function Chart({
    chartProps,
    isLoading
}) {

    const chartComponent = useRef(null); 
    const chart = chartComponent.current?.chart;
    useEffect(()=> {
      if (chart) { // show and hide Loading... text
          chart.showLoading();
          if (!isLoading) {
              chart.hideLoading();
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
