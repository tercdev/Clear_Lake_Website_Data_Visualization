import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useFetch from 'react-fetch-hook'
import './StreamChart.css'
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/export-data')(Highcharts)

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

  var flow_new_url = flowurl.toString();  
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
  },[creekData.isLoading,flowData.isLoading])

  return (
    <div>
        {creekData.isLoading && <p className='loading-info'>Fetching Creek Data...</p>}
        {dataType2 != null && flowData.isLoading && <p className='loading-info'>Fetching Flow Data...</p>}
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={true}
            options={chartOptions}  />
    </div>
  )
}
