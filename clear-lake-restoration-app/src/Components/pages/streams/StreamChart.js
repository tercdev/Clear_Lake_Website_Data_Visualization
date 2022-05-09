import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useFetch from 'react-fetch-hook'

import './StreamChart.css'

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
        {/* {dataType2 != null && isLoading && <p className='loading-info'>Fetching Flow Data...</p>} */}
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={true}
            options={chartProps}  />
    </div>
  )
}
