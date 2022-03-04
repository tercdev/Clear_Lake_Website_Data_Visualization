// get data based on graph type
function getFilteredData(data, dataType) {
    let m = [];

    data.forEach((element => {
        let pstTime = convertGMTtoPSTTime(new Date(element.DateTime_UTC));
        if (dataType == "Wind_Dir") {
            m.push([pstTime.getTime(), cardinalToDeg(element[dataType])]);
        } else {
            m.push([pstTime.getTime(), parseFloat(element[dataType])]);
        }
        
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
    var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/metweatherlink');
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

var obj = {
    0: 'South',
    90: 'West',
    180: 'North',
    270: 'East',
    360: 'South'
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
    
        
        MyAirTemp_RelHumChart.updateData(idValue, fromTime, toTime);
        MyAtmPressureChart.updateData(idValue, fromTime, toTime);
        MyWindSpeedDirChart.updateData(idValue, fromTime, toTime);
    });
}

// Air Tempurature and Relative Humidity Chart component
var MyAirTemp_RelHumChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('air-temp-rel-hum-container', {
            chart: {
                zoomType: 'x',
                //height: 500,
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
                    format: '{value}°C',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },
                title: {
                    text: 'Air Temperature [°C]',
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
                    text: 'Relative Humidity [%]',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}%',
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
                    const dateString = (Month + 1) + "-" + DayOfMonth + "-" + Year + "  " + TimeHrs + ":" + TimeMins + ' PST';
                    return [dateString].concat(
                        this.points ?
                            this.points.map(function (point) {
                                if (point.series.name  == 'Relative Humidity') {
                                    return point.series.name + ': ' + point.y +'%'
                                }
                                else {
                                    return point.series.name + ': ' + point.y +'°C';
                                }
                                
                            }) : []
                    );
                },
                split: true
            },

            series: [
                {
                    name: 'Air Temperature',
                    data: [],
                    selected: true,
                    yAxis: 0,
                    color: Highcharts.getOptions().colors[3],
                    
                }, 
                {
                    name: 'Relative Humidity',
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
    async updateData(id, rptdate,rptend) {
        this.chart.showLoading();
        let airTempData = await asyncGetData(id,rptdate,rptend,"Air_Temp");
        let relHumidityData = await asyncGetData(id,rptdate,rptend,"Rel_Humidity");           
        this.chart.hideLoading();
        this.chart.series[0].setData(airTempData);
        this.chart.series[1].setData(relHumidityData);
                
    }
}


// Atmospheric Pressure Chart component
var MyAtmPressureChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('atm-pressure-container', {
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
                labels: {
                    format: '{value} kPa',
                    style: {
                        color: Highcharts.getOptions().colors[4]
                    }
                },
                title: {
                    text: 'Atmospheric Pressure [kPa]',
                    style: {
                        color: Highcharts.getOptions().colors[4]
                    }
                },
                lineColor: Highcharts.getOptions().colors[4],
                lineWidth: 5,
            },
        
            series: [
                {
                    name: 'Atmospheric Pressure',
                    data: [],
                    selected: true,
                    color: Highcharts.getOptions().colors[4]
                },
            ],
            tooltip: {
                headerFormat: '<b>{series.name} {point.y} kPA</b><br>',
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
        let dataFromGet = await asyncGetData(id,rptdate,rptend,"Atm_Pres");           
        this.chart.hideLoading();
        this.chart.series[0].setData(dataFromGet);         
    },
}


// Wind Speed and Wind Direction Chart component
var MyWindSpeedDirChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('wind-speed-dir-container', {
            chart: {
                zoomType: 'x',
                // height: 700,
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: 
            [{ 
                title: {
                    text: 'Wind Direction [degrees]',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },
                // labels: {
                //     format: '{value}°',
                //     style: {
                //         color: Highcharts.getOptions().colors[3]
                //     }
                // },
                // labels: {
                tickPositions: [0, 90, 180, 270, 360],
                labels: {
                    formatter: function() {
                    return (obj[this.value])
                    }
                },
                // height: '50%',
                // top: '50%',
                lineColor: Highcharts.getOptions().colors[3],
                lineWidth: 5,
                max: 360,
                tickInterval: 90
            },
            { 
                labels: {
                    format: '{value} m/s',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                title: {
                    text: 'Wind Speed [m/s]',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true,
                lineColor: Highcharts.getOptions().colors[0],
                lineWidth: 5,
                gridLineWidth: 0,
            }, 
        ],
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name} {point.y}°</b><br>',
                        pointFormat: '{point.x:%m/%d/%y %H:%M:%S}'
                    }
                },
                line: {
                    tooltip: {
                        headerFormat: '<b>{series.name} {point.y} m/s</b><br>',
                        pointFormat: '{point.x:%m/%d/%y %H:%M:%S}'
                    }
                }
            },

            series: [
                {
                    name: 'Wind Direction',
                    data: [],
                    selected: true,
                    yAxis: 0,
                    color: Highcharts.getOptions().colors[3],
                    type: 'scatter',
                },
                {
                    name: 'Wind Speed',
                    data: [],
                    selected: true,
                    yAxis: 1,
                    color: Highcharts.getOptions().colors[0],
                    type: 'line',
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
        let windSpeedData = await asyncGetData(id,rptdate,rptend,"Wind_Speed");
        let windDirData = await asyncGetData(id,rptdate,rptend,"Wind_Dir");           
        this.chart.hideLoading();
        this.chart.series[1].setData(windSpeedData);
        this.chart.series[0].setData(windDirData);         
    }
}



var MySolarChart = {
    initHighCharts: function() {
        this.chart = Highcharts.getJSON(
            // had temporarily delete some data since too much
            // will fix when API up
            cleanDataURL,
            function (data) {
                console.log(data);
                let result = [];
                data.forEach(m => {
                    result.push([new Date(m.doy).getTime(), m.SWin]);
                })
                console.log(result);
                Highcharts.chart('solar-container', {
                    chart: {
                    zoomType: 'x'
                    },
                    title: {
                    text: '',
                    color: Highcharts.getOptions().colors[0],
                    },
                    
                    xAxis: {
                    type: 'datetime'
                    },
                    yAxis: {
                    title: {
                        text: 'Solar [W/m2]'
                    }
                    },
                    legend: {
                    enabled: false
                    },
                    series: [
                        {
                            // type: 'area',
                            name: 'Solar',
                            data: result,
                            color: Highcharts.getOptions().colors[0],
                        }, 
                        
                    ],
                    tooltip: {
                        headerFormat: '<b>{series.name} {point.y} W/m2</b><br>',
                        pointFormat: '{point.x:%m/%d/%y %H:%M:%S} PST'
                    }
                });
            }
        );
    }
}

  
Highcharts.setOptions({
    time: {
        useUTC: false
    }
});

// async function getCSVData() {
//     console.log(document.getElementById('myHiddenFilename').value)
//     const response = await fetch(document.getElementById('myHiddenFilename').value);
//     const table = await response.text();
//     console.log(table);
// }

function main() {
    var currentTime = getCurrentTime();
    var lastWeekDate = getPreviousWeekDate();

    var idValue = parseInt($("#myInputHidden").val());
    console.log(idValue);   
   // getCSVData();

    // if (idValue == 1) {
        cleanDataURL = "/Clean Data/Meteorological/Clear Lake - Met data/BKP.json";
    // } 

    // will show a graph of current week's data when page first loads
    MyAirTemp_RelHumChart.initHighCharts();
    MyAirTemp_RelHumChart.updateData(idValue, lastWeekDate, currentTime);
    MyAtmPressureChart.initHighCharts();
    MyAtmPressureChart.updateData(idValue, lastWeekDate, currentTime);
    MyWindSpeedDirChart.initHighCharts();
    MyWindSpeedDirChart.updateData(idValue, lastWeekDate, currentTime);
    MySolarChart.initHighCharts();
}

main();
 