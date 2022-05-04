import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useFetch from 'react-fetch-hook'


export default function StreamChart({
    // fromDate,
    // endDate,
    // id,
    // dataType,
    // dataType2 = null,
    chartProps,
    isLoading
}) {

    const chartComponent = useRef(null); 
   // this.chart = React.createRef();
    // let chartObj = char.current.chart;
    //const [chartOptions, setChartOptions] = useState(chartProps)
    useEffect(()=> {
        console.log(isLoading)
        if (!isLoading) {
            //chartObj.showLoading();
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
