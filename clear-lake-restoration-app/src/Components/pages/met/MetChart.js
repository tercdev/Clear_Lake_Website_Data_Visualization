import React, {useState,useEffect,useRef } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { convertDate } from '../../utils.js';
import useFetch from 'react-fetch-hook';

import highchartsWindbarb from 'highcharts/modules/windbarb';

highchartsWindbarb(Highcharts);

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
    if (parseFloat(direction) == direction) {
        return parseFloat(direction)
    }
    if (direction == 'N') {
        return 0
    };
    if (direction == 'NNE') {
        return 22.5
    };
    if (direction == 'NE') {
        return 45
    };
    if (direction == 'ENE') {
        return 67.5
    };
    if (direction == 'E') {
        return 90
    };
    if (direction == 'ESE') {
        return 112.5
    };
    if (direction == 'SE') {
        return 135
    };
    if (direction == 'SSE') {
        return 157.5
    };
    if (direction == 'S') {
        return 180
    };
    if (direction == 'SSW') {
        return 202.5
    };
    if (direction == 'SW') {
        return 225
    };
    if (direction == 'WSW') {
        return 247.5
    };
    if (direction == 'W') {
        return 270
    };
    if (direction == 'WNW') {
        return 292.5
    };
    if (direction == 'NW') {
        return 315
    };
    if (direction == 'NNW') {
        return 337.5
    };

    return 0
    // direction == ---
}  
  // get data based on graph type
function getFilteredData(data, dataType) {
    let m = [];
    // if (dataType == "Turb_BES") {
    //     var data = cleanTurbMeanData(data,dataType)
    // }
    data.forEach((element => {
        // let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
        let pstTime = new Date(element.DateTime_UTC);
        if (dataType == "Wind_Dir") {
            m.push([pstTime.getTime(), cardinalToDeg(element[dataType])]);
        } else {
            m.push([pstTime.getTime(), parseFloat(element[dataType])]);
        }
    }));
    return m.reverse();
}
function getWindbarbData(data) {
    let m = [];
    data.forEach((element => {
        let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
        m.push([pstTime.getTime(), parseFloat(element["Wind_Speed"]), cardinalToDeg(element["Wind_Dir"])])
    }))
    return m.reverse();
}

function removePast(data, date) {
    if (date == undefined) {
        return data;
    }
    let i = 0;
    while (data[i][0] <= date) {
        data.shift();
    }
    return data;
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
  var real_time_url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
  var clean_data_url = new URL('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');
  let real_search_params = real_time_url.searchParams;
  real_search_params.set('id',id);

  real_search_params.set('rptdate', convertDate(fromDate)); // at most 180 days away from endDate
  real_search_params.set('rptend', convertDate(endDate));
  real_time_url.search = real_search_params.toString();

  var url = new URL('https://4ery4fbt1i.execute-api.us-west-2.amazonaws.com/default/clearlake-met');
  var search_params = url.searchParams;
  search_params.set('id',id);
  search_params.set('start',convertDate(fromDate));
  search_params.set('end',convertDate(endDate));
  url.search = search_params.toString();

  var new_url = url.toString();
  const {isLoading,data} = useFetch(new_url);

  const realTimeData = useFetch(real_time_url.toString());

  useEffect(()=> {
    console.log(isLoading)
    if (!isLoading && !realTimeData.isLoading) {
        var filteredData = getFilteredData(data,dataType);
        let filteredRealTimeData = getFilteredData(realTimeData.data, dataType); // start from lastdate
        if (filteredData.length != 0) {
            var lastdate = filteredData[0][0]
            console.log(filteredRealTimeData)
            console.log(filteredData)
            console.log(new Date(filteredData[0][0])) //1643155200000
            console.log(new Date(filteredRealTimeData[filteredRealTimeData.length-1][0])) //1644004801000
            
            let dataLastDate = new Date(filteredData[0][0]);
            let realDataLastDate = new Date(filteredRealTimeData[0][0]);
            let realDataFirstDate = new Date(filteredRealTimeData[filteredRealTimeData.length-1][0])
            if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                filteredRealTimeData = []
                lastdate = undefined
            }
            filteredRealTimeData = removePast(filteredRealTimeData, lastdate);
            
            console.log(filteredRealTimeData)
        }

        if (dataType2) {
            var filteredData2 = getFilteredData(data,dataType2);
            console.log(filteredData2)
            let filteredRealTimeData2 = getFilteredData(realTimeData.data,dataType2);
            if (filteredData2.length != 0) {
                lastdate = filteredData[0][0];
                let dataLastDate = new Date(filteredData2[0][0]);
                let realDataLastDate = new Date(filteredRealTimeData2[0][0]);
                let realDataFirstDate = new Date(filteredRealTimeData2[filteredRealTimeData2.length-1][0])            
                if (dataLastDate.getDay() == realDataLastDate.getDay() || dataLastDate.getDay() == realDataFirstDate.getDay()) {
                    filteredRealTimeData2 = []
                    lastdate = undefined
                }
                filteredRealTimeData2 = removePast(filteredRealTimeData2, lastdate);
                
                console.log(filteredRealTimeData2)
                
            }
            // if (dataType2 == "Wind_Dir") {
            //     var windbarbData = getWindbarbData(data);
            //     let windbarbRealTimeData = getWindbarbData(realTimeData.data);
            //     if (windbarbData.length != 0) {
            //         windbarbRealTimeData = removePast(windbarbRealTimeData, lastdate);
            //         if (Date(windbarbData[0][0]) == Date(windbarbRealTimeData[0][0])) {
            //             windbarbRealTimeData = []
            //             lastdate = undefined
            //         }
            //     }
            //     if (windbarbRealTimeData == []) {
            //         setChartOptions(()=>({
            //             series: [
            //                 {
            //                     data: filteredData
            //                 },
            //                 {
            //                     data: filteredRealTimeData
            //                 },
            //                 {
            //                     data: windbarbData
            //                 },
            //                 {
            //                     // data: windbarbRealTimeData
            //                 },
            //             ],
            //         }))
            //     } else {
            //         setChartOptions(()=>({
            //             series: [
            //                 {
            //                     data: filteredData
            //                 },
            //                 {
            //                     data: filteredRealTimeData
            //                 },
            //                 {
            //                     data: windbarbData
            //                 },
            //                 {
            //                     data: windbarbRealTimeData
            //                 },
            //             ],
            //             xAxis: {
            //                 plotLines: [{
            //                     color: '#FF0000',
            //                     width: 5,
            //                     value: lastdate
            //                 }]
            //             }
            //         }))
            //     }
            // } else {
                setChartOptions(()=> ({
                    series: [
                        {
                            data: filteredData2
                        },
                        {
                            data: filteredRealTimeData2
                        },
                        {
                            data: filteredData
                        },
                        {
                            data: filteredRealTimeData
                        }
                    ],
                    xAxis: {
                        plotLines: [{
                            color: '#FF0000',
                            width: 5,
                            value: lastdate
                        }]
                    }
                }))
            // }
        }
        else {
            console.log("here")
            setChartOptions(()=> ({
                series: [
                    {
                        data: filteredData
                    },
                    {
                        data: filteredRealTimeData
                    }
                ],
                xAxis: {
                    plotLines: [{
                        color: '#FF0000',
                        width: 5,
                        value: lastdate
                    }]
                }
            }))
        }
    }
    
  },[isLoading, realTimeData.isLoading])

  return (
    <div>
        {isLoading && <p className='loading-info'>Fetching Data...</p>}
        {realTimeData.isLoading && <p className='loading-info'>Fetching Data...</p>}
        <HighchartsReact 
            highcharts={Highcharts}
            ref={chartComponent}
            allowChartUpdate={true}
            options={chartOptions}  />
    </div>
  )
}