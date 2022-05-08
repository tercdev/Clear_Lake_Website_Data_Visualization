import React, { useEffect, useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import './StreamChart.css';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

export default function StreamChart({
    chartProps,
    isLoading
}) {

    const chartComponent = useRef(null); 

    useEffect(()=> {
        console.log(isLoading)
        if (!isLoading) {
        }
    },[isLoading])

  return (
    <div>
        {isLoading && <p className='loading-info'>Fetching Creek Data...</p>}
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={true}
            options={chartProps}  />
    </div>
  )
}
