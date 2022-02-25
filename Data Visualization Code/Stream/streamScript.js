var rainURL = "/Clean Data/Stream/precipitation/";

// get data based on graph type
function getFilteredData(data, dataType) {
    let m = [];
    data.forEach((element => {
        let pstTime = convertGMTtoPSTTime(new Date(element.TmStamp));
        m.push([pstTime.getTime(), parseFloat(element[dataType])]);
    }));
    return m;
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
    var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('rptdate',rptdate);
    search_params.set('rptend',rptend);
    url.search = search_params.toString();

    var new_url = url.toString();
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
                console.log(result);
                Highcharts.chart('rain-container', {
                    chart: {
                    zoomType: 'x'
                    },
                    title: {
                    text: 'Precipitation'
                    },
                    subtitle: {
                    text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
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
                        
                    ]
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
                height: 700,
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            title: {
                text: 'Turbity Mean and Flow Chart'
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
                    text: 'Turbity [NTU]',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },
                opposite: true,
                height: '50%',
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
                height: '50%',
                top: '50%',
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
                    name: 'Turbity',
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
        //let flowData = await asyncGetData(id,rptdate,rptend,"");           
        this.chart.hideLoading();
        this.chart.series[0].setData(turbData);
        //this.chart.series[1].setData(flowData);
                
    }
}


// Tempurature Chart component
var MyTemperatureChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('temp-container', {
            chart: {
                zoomType: 'x'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            title: {
                text: 'Stream Temperature'
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

      

function main() {
    var currentTime = getCurrentTime();
    var lastWeekDate = getPreviousWeekDate();
    var idValue = parseInt($("#myInputHidden").val());
    console.log(idValue);  

    if (idValue == 1) {
        rainURL += "KCK_precip_WWG.json";
    } else if (idValue == 2) {
        rainURL += "MCU_precip_WWG.json";
    } else if (idValue == 3) {
        rainURL += "SCS_precip_WWG.json";
    }

    console.log(rainURL);
    // will show a graph of current week's data when page first loads
    MyTurbMean_FlowChart.initHighCharts();
    MyTurbMean_FlowChart.updateData(idValue, lastWeekDate, currentTime);
    MyRainChart.initHighCharts();
    MyTemperatureChart.initHighCharts();
    MyTemperatureChart.updateData(idValue, lastWeekDate, currentTime);
}

main();
 