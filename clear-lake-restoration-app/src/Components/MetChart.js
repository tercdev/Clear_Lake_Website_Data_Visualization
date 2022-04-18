import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useFetch from 'react-fetch-hook'

function convertGMTtoPSTTime (date) {
    // reference: https://stackoverflow.com/questions/22493924/get-user-time-and-convert-them-to-pst
    var offset = 420; 
    var offsetMillis = offset * 60 * 1000;
    var today = date;
    var millis = today.getTime();
    var timeZoneOffset = (today.getTimezoneOffset() * 60 * 1000);

    var pst = millis - offsetMillis; 
    return new Date(today.getTime() - timeZoneOffset);
}
//conversion from API cardinal to prgm degree
function cardinalToDeg(direction) {
    if (direction == 'N') {
        return 180
    };
    if (direction == 'NNE') {
        return 202.5
    };
    if (direction == 'NE') {
        return 225
    };
    if (direction == 'ENE') {
        return 247.5
    };
    if (direction == 'E') {
        return 270
    };
    if (direction == 'ESE') {
        return 292.5
    };
    if (direction == 'SE') {
        return 315
    };
    if (direction == 'SSE') {
        return 337.5
    };
    if (direction == 'S') {
        return 0
    };
    if (direction == 'SSW') {
        return 22.5
    };
    if (direction == 'SW') {
        return 45
    };
    if (direction == 'WSW') {
        return 67.5
    };
    if (direction == 'W') {
        return 90
    };
    if (direction == 'WNW') {
        return 112.5
    };
    if (direction == 'NW') {
        return 135
    };
    if (direction == 'NNW') {
        return 157.5
    };
}  
  // get data based on graph type
function getFilteredData(data, dataType) {
    let m = [];
    // if (dataType == "Turb_BES") {
    //     var data = cleanTurbMeanData(data,dataType)
    // }
    data.forEach((element => {
        let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
        if (dataType == "Wind_Dir") {
            m.push([pstTime.getTime(), cardinalToDeg(element[dataType])]);
        } else {
            m.push([pstTime.getTime(), parseFloat(element[dataType])]);
        }
    }));
    return m.reverse();
}

export default function MetChart({
    fromDate,
    endDate,
    id,
    dataType,
    dataType2=null,
    chartProps
}) {

  const chartComponent = useRef(null); 
  const [chartOptions, setChartOptions] = useState(chartProps)
  var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
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
        var filteredData = getFilteredData(data,dataType)

        if (dataType2) {
            var filteredData2 = getFilteredData(data,dataType2)
            setChartOptions(()=> ({
                series: [
                    {
                        data: filteredData2
                    },
                    {
                        data: filteredData
                    }
                ]
            }))
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

        console.log(filteredData)

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
