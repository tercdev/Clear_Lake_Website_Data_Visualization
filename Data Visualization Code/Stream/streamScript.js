var rainURL = "/Clean Data/Stream/precipitation/";

function cleanTurbMeanData(data) {

    // arrays to store dates to clean data in format: from,to,threshold
    // if no threshhold then -1
    var KelseyTimetoNAN = [
        [new Date("2019-02-26 02:30:00"), new Date("2019-03-04 23:00:00"),-1], // clogged sensor
        [new Date("2019-06-01 00:00:00"), new Date("2019-06-22 00:00:00"),-1], // high values during low flow
        [new Date("2021-01-12 00:00:00"), new Date("2021-01-26 00:00:00"),-1], // high values during low flow
        [new Date("2021-04-12 00:00:00"), new Date("2021-07-26 00:00:00"),-1], // remove nans for short period in may 2021 when sensor was briefly turned on
        [new Date("2021-11-01 00:00:00"), new Date("2021-12-13 16:00:00"),-1], // high values during low flow
    ]
    var MiddleTimetoNAN = [
        [new Date("2019-06-04 00:00:00"), new Date("2019-07-17 00:00:00"),-1], // high values during low flow
        [new Date("2020-06-04 00:00:00"), new Date("2020-03-04 22:00:00"),-1], // high values during low flow
        [new Date("2020-04-08 23:30:00"), new Date("2020-05-17 04:00:00"),-1], // high values during low flow
        [new Date("2020-05-19 15:00:00"), new Date("2020-07-17 04:00:00"),-1], // high values during low flow
        [new Date("2021-01-19 15:00:00"), new Date("2021-01-27 20:45:00"),-1],
        [new Date("2021-03-19 20:50:00"), new Date("2021-08-27 20:45:00"),-1], // % high values during low flow
        [new Date("2021-12-26 02:40:00"), new Date("2022-01-12 06:40:00"),-1], // clogged sensor
        [new Date("2022-01-18 00:00:00"), new Date("2022-02-14 00:00:00"),10]
    ]
    var ScottsTimetoNAN = [
        [new Date("2019-01-18 05:40:00"), new Date("2019-02-09 00:30:00"),-1], // clogged sensor
        [new Date("2019-03-23 16:30:00"), new Date("2019-03-25 08:50:00"),-1], // clogged sensor
        [new Date("2019-03-31 09:30:00"), new Date("2019-04-04 02:10:00"),-1],// clogged sensor
        [new Date("2019-03-31 09:30:00"), new Date("2019-04-04 02:10:00"),-1],// clogged sensor
        [new Date("2019-05-07 05:00:00"), new Date("2019-07-14 00:00:00"),-1], // sunlight interference Fix #3 MICAH
        [new Date("2019-11-26 21:00:00"), new Date("2019-11-27 12:00:00"),-1], // clogged sensor
        [new Date("2019-11-30 18:30:00"), new Date("2019-12-04 22:20:00"),-1], //clogged sensor
        [new Date("2019-12-28 05:12:00"), new Date("2019-12-28 14:20:00"),-1], //clogged sensor
        [new Date("2019-12-29 19:50:00"), new Date("2019-12-30 01:20:00"),-1], // cloggged sensor
        [new Date("2019-12-29 19:50:00"), new Date("2020-01-09 01:20:00"),5], //removing all values above 5 NTu when flow was less than 20 in jan 2020
         [new Date("2022-01-18 00:00:00"), new Date("2022-02-14 00:00:00"),-1],
         // removing vals
        [new Date("2019-01-17 14:20:00"), new Date("2019-01-20 01:20:00"),-1], // clogged sensor
        [new Date("2020-01-11 00:00:00"), new Date("2020-01-14 06:20:00"),5],//removing all values above 5 NTu when flow was less than 20 in jan 2020

        [new Date("2020-02-05 06:00:00"), new Date("2020-02-06 06:20:00"),-1], // clogged sensor
        [new Date("2020-02-07 00:00:00"), new Date("2020-03-14 05:50:00"),1], // sensor looks to be dry removing any values above 1 NTU0 from 2/7/20 - 3/14/20
        [new Date("2020-03-06 00:00:00"), new Date("2021-03-10 05:20:00"),1], //sensor looks to be dry removing any values above 1 NTU
        [new Date("2020-03-13 00:00:00"), new Date("2020-04-04 18:10:00"),1], // sensor looks to be dry removing any values above 1 NTU0 from 3/19/20 - % 4/4/20
        [new Date("2020-04-08 00:00:00"), new Date("2020-05-11 00:00:00"),1], // sensor looks to be dry removing any values above 1 NTU0 from 3/19/20 - 4/4/20
        [new Date("2020-05-15 00:00:00"), new Date("2020-05-18 06:20:00"),1], //sensor looks to be dry removing any values above 1 NTU0 
        [new Date("2020-05-20 06:00:00"), new Date("2020-06-20 05:50:00"),-1], //S clogged sensor
        [new Date("2020-12-01 00:00:00"), new Date("2021-08-01 21:15:00"),1], //sensor looks to be dry removing any values above 1 NTU0 from 3/19/20 -4/4/20
        [new Date("2021-04-25 17:50:00"), new Date("2021-04-25 19:40:00"),-1], // clogged sensor
        [new Date("2021-05-18 16:40:00"), new Date("2020-05-19 05:40:00"),-1], // clogged sensor
        [new Date("2021-05-15 22:10:00"), new Date("2020-05-15 22:30:00"),-1], // clogged sensor
        [new Date("2021-06-14 12:10:00"),new Date("2021-06-14 12:10:00"),-1], // clogged sensor
        [new Date("2022-01-04 00:00:00"), new Date("2022-05-11 00:00:00"),1] // MICAH

    ]
    var cleanDates = 0;
    if (data[0].Creek == "Kelsey") {
        var cleanDates = KelseyTimetoNAN;
    }
    else if (data[0].Creek == "Middle") {
        var cleanDates = MiddleTimetoNAN;
    }
    else if (data[0].Creek == "Scotts") {
        var cleanDates = ScottsTimetoNAN;
    }
    data.forEach((element) => { 
        //  set all values >1600 NTU = NTU (Max sensor range)
        if (element.Turb_BES > 1600) {
            element.Turb_BES = 1600;
        }
        
        cleanDates.forEach((elem)=>{
            var tempDate = new Date(element.TmStamp)

            if (tempDate >= elem[0] && tempDate <= elem[1] && element.Turb_BES > elem[2]) {
                console.log("clean",elem[0])
                element.Turb_BES = "NAN"
            }
        })
    });
    return data;
}

// get data based on graph type
function getFilteredData(data, dataType) {
    let m = [];
    if (dataType == "Turb_BES") {
        var data = cleanTurbMeanData(data,dataType)
    }
    if (dataType == "Flow") {
        data.forEach((element => {
            //let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
    
            m.push([new Date(element.DateTime_UTC).getTime(), parseFloat(element[dataType])]);
        }));
    }
    else {
        data.forEach((element => {
            let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
    
            m.push([pstTime.getTime(), parseFloat(element[dataType])]);
        }));
    }
    
    return m.reverse();
}

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

// async bc of the await
// waits for data to be fetched
async function asyncGetData(id,rptdate,rptend,dataType) {
    if (dataType != "Flow") {
        var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
        var search_params = url.searchParams;
        search_params.set('id',id);
        search_params.set('rptdate',rptdate);
        search_params.set('rptend',rptend);
        url.search = search_params.toString();
        var new_url = url.toString();
    }
    else {
        var flowurl = new URL('https://b8xms0pkrf.execute-api.us-west-2.amazonaws.com/default/clearlake-streams')

        var search_params_flow = flowurl.searchParams;
        search_params_flow.set('id',id);
        search_params_flow.set('start',rptdate);
        search_params_flow.set('end',rptend);
        flowurl.search = search_params_flow.toString();
        var new_url = flowurl.toString();
    }
   
    let rawDataJson = await fetch(new_url)
        .then(res => res.json());

    var queriedData = [];
    queriedData = getFilteredData(rawDataJson,dataType);
   
    return queriedData;
}

function getPreviousWeekDate() {
    var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    var month = (lastWeek.getUTCMonth() + 1).toString(); //months from 1-12
    var day = lastWeek.getUTCDate().toString();
    var year = lastWeek.getUTCFullYear().toString();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return year+month+day;
}

function getCurrentTime() {
    var time = new Date().toLocaleDateString();
    time = time.split('/');
    var currentTimeArr = time.slice(0).reverse().map(
        val => { return val;
    })
    if (currentTimeArr[1].length < 2) {
        currentTimeArr[1] = '0' + currentTimeArr[1];
    }
    if (currentTimeArr[2].length < 2) {
        currentTimeArr[2] = '0' + currentTimeArr[2];
    }
    var curTime = currentTimeArr[0] + currentTimeArr[2] + currentTimeArr[1];
    return curTime;
}

// get the inputted time from the time form
var timeForm = document.querySelector("#time-form-info");

if (timeForm){
    timeForm.addEventListener("submit", function (event) {
        // stop form submission
        event.preventDefault();
        var fromTime = timeForm.elements["from-time"].value.replace(/-/g,'');
        var toTime = timeForm.elements["to-time"].value.replace(/-/g,'');
        var idValue = parseInt($("#myInputHidden").val());

        MyTurbMean_FlowChart.updateData(idValue, fromTime, toTime);
        MyTemperatureChart.updateData(idValue, fromTime, toTime);
        
    });
}


var MyRainChart = {
    initHighCharts: function() {
        this.chart = Highcharts.getJSON(
            rainURL,
            function (data) {
                //console.log(data);
                let result = [];
                data.forEach(m => {
                    result.push([new Date(m.Date).getTime(), m.Rain]);
                    //console.log([m.Date + " " + m.Time.toString(), parseFloat(m.Latest_Rain)]);
                })
                //console.log(result);
                Highcharts.chart('rain-container', {
                    chart: {
                    zoomType: 'x'
                    },
                    title: {
                    text: ''
                    },
                    
                    xAxis: {
                    type: 'datetime'
                    },
                    yAxis: {
                    title: {
                        text: 'Precipitation [in]'
                    }
                    },
                    legend: {
                    enabled: false
                    },
                    series: [
                        {
                            type: 'area',
                            name: 'Precipitation',
                            data: result,
                        }, 
                        
                    ],
                    tooltip: {
                        headerFormat: '<b>{series.name} {point.y} in</b><br>',
                        pointFormat: '{point.x:%m/%d/%y %H:%M:%S} PST'
                    },
                    
                });
            }
        );
    }
}


// Turb Mean and Flow Chart component
var MyTurbMean_FlowChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('turb-container', {
            chart: {
                zoomType: 'x',
                //height: 700,
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: 
            [{ // Primary yAxis
                labels: {
                    format: '{value} NTU',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },
                title: {
                    text: 'Turbidity [NTU]',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },
                opposite: true,
                // height: '50%',
                lineColor: Highcharts.getOptions().colors[3],
                lineWidth: 5,
               
            }, { // Secondary yAxis
                title: {
                    text: 'Flow [cfs]',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} cfs',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                // height: '50%',
                // top: '50%',
                lineColor: Highcharts.getOptions().colors[0],
                lineWidth: 5,
                
            }],
            tooltip: {
                formatter: function () {
                    // The first returned item is the header, subsequent items are the
                    // points
                    const DayOfMonth = new Date(this.x).getDate();
                    const Month = new Date(this.x).getMonth(); // Be careful! January is 0, not 1
                    const Year = new Date(this.x).getFullYear();
                    const TimeHrs = new Date(this.x).getHours();
                    const TimeMins = new Date(this.x).getMinutes();
                    const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + TimeHrs + ":" + TimeMins;
                    return [dateString].concat(
                        this.points ?
                            this.points.map(function (point) {
                                return point.series.name + ': ' + point.y;
                            }) : []
                    );
                },
                split: true
            },

            series: [
                {
                    name: 'Turbidity',
                    data: [],
                    selected: true,
                    yAxis: 0,
                    color: Highcharts.getOptions().colors[3],
                    
                }, 
                {
                    name: 'Flow',
                    data: [],
                    selected: true,
                    yAxis: 1,
                    color: Highcharts.getOptions().colors[0],
                },
                 
            ],
            updateTime: {
                setTime: 0,
                endTime: 0,
            },
        });
    },
    updateTime: {
        setTime: 0,
        endTime: 0
    },

    // update the chart based on the new queries
    // need to wait until the data is fetched
    async updateData(id,rptdate,rptend) {
        this.chart.showLoading();
        let turbData = await asyncGetData(id,rptdate,rptend,"Turb_BES");
        let flowData = await asyncGetData(id,rptdate,rptend,"Flow");           
        this.chart.hideLoading();
        this.chart.series[0].setData(turbData);
        this.chart.series[1].setData(flowData);
                
    }
}


// Tempurature Chart component
var MyTemperatureChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('temp-container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'stream temperature',
                text: null
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Temperature in Celsius'
                }
            },
        
            series: [
                {
                    name: 'Temperature',
                    data: [],
                    selected: true
                },
            ],
            tooltip: {
                headerFormat: '<b>{series.name} {point.y} °C</b><br>',
                pointFormat: '{point.x:%m/%d/%y %H:%M:%S} PST'
            },
            updateTime: {
                setTime: 0,
                endTime: 0,
            },
        });
    },
    updateTime: {
        setTime: 0,
        endTime: 0
    },

    // update the chart based on the new queries
    // need to wait until the data is fetched
    async updateData(id,rptdate,rptend) {
        this.chart.showLoading();
        let dataFromGet = await asyncGetData(id,rptdate,rptend,"Turb_Temp");
        this.chart.hideLoading();
        this.chart.series[0].setData(dataFromGet);
    },
}
  

// $(document).ready(function() {
//     $.ajax({
//         type: "GET",
//         url: "/Clean Data/Stream/precipitation/KEL-22021-22022.csv",
//         dataType: "text",
//         success: function(data) {processData(data);}
//      });
// });

// function processData(allText) {
//     var allTextLines = allText.split(/\r|\n/);
    
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i=1; i<allTextLines.length; i++) {
//         var data = allTextLines[i].split(',');
//         if (data.length == headers.length) {
//             lines.push([data[0]+ " " +data[1], parseFloat(data[2])]);
//         }
//     }

//     //console.log(headers);
//     //console.log(lines);
//     return lines;
//     // alert(lines);
// }

    
// async function getCSVData() {
//     console.log(document.getElementById('myHiddenFilename').value)
//     const response = await fetch(document.getElementById('myHiddenFilename').value);
//     const table = await response.text();
//     console.log(table);
//     return table;
// }
      

function main() {
    var currentTime = getCurrentTime();
    var lastWeekDate = getPreviousWeekDate();
    var idValue = parseInt($("#myInputHidden").val());
    console.log(idValue);  

   // getCSVData();

    if (idValue == 1) {
        rainURL += "KCK_precip_WWG.json";
    } else if (idValue == 2) {
        rainURL += "MCU_precip_WWG.json";
    } else if (idValue == 3) {
        rainURL += "SCS_precip_WWG.json";
    }

    //console.log(rainURL);
    // will show a graph of current week's data when page first loads
    MyTurbMean_FlowChart.initHighCharts();
    MyTurbMean_FlowChart.updateData(idValue, lastWeekDate, currentTime);
    MyRainChart.initHighCharts();
    MyTemperatureChart.initHighCharts();
    MyTemperatureChart.updateData(idValue, lastWeekDate, currentTime);
}

main();
 