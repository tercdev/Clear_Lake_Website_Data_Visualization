import React, { useEffect, useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ErrorBoundary from './ErrorBoundary';
import fullscreen from "highcharts/modules/full-screen";


// for the hamburger button in the top right corner of each chart that lets users download different formats of the chart
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
fullscreen(Highcharts);

/**
 * Component for showing Highcharts chart
 * @param {Object} chartProps chart properties object
 * @param {boolean} isLoading whether data is still being fetched or not
 * @param {boolean} isEmpty whether there is or no data available
 * @returns {JSX.Element}
 */
export default function Chart({
    chartProps,
    isLoading,
    isEmpty
}) {
    const chartComponent = useRef(null); 
    useEffect(()=> {
      const chart = chartComponent.current?.chart;
      if (chart) { // show and hide Loading... text
          chart.showLoading();
          if (!isLoading) {
              chart.hideLoading();
          }
      }
    },[isLoading])

  return (
      <ErrorBoundary>        
          {isEmpty && !isLoading ? 
          <p className='no-data-disclaimer'>No data to show. Please select a different period.</p>:<></>}
          <HighchartsReact 
          highcharts={Highcharts}
          ref={chartComponent}
          allowChartUpdate={true}
          options={chartProps}  />
      </ErrorBoundary>
  )
}
