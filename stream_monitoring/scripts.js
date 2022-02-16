// value: [TmStamp, Turb_BES]
// TmStamp: in milliseconds
// Turb_Mean: in floats
function getTurbMean(data) {
    let m = [];
    data.forEach((element =>
        m.push([new Date(element.TmStamp).getTime(), parseFloat(element.Turb_BES)]))
    );
    return m;
}

// value: [TmStamp, Turb_Temp]
// TmStamp: in milliseconds
// Turb_Temp: in floats
function getTurbTemp(data) {
    let m = [];
    data.forEach((element =>
        m.push([new Date(element.TmStamp).getTime(), parseFloat(element.Turb_Temp)]))
    );
    return m;
}

// get creekID based on input name
function getCreekID(creekName) {
    switch (creekName) {
        case "kelsey":
            return 1;
        case "middle":
            return 2;
        case "scotts":
            return 3;
    } 
}

// async bc of the await
// waits for data to be fetched
// once raw data (in JSON format) fetched, 
// get the creekName and queried data (depending on TurbMean or TurbTemp)
async function asyncGetData(id,rptdate,rptend,dataKind) {
    var url = new URL('https://tepfsail50.execute-api.us-west-2.amazonaws.com/v1/report/cl-creeks');
    var search_params = url.searchParams;
    search_params.set('id',id);
    search_params.set('rptdate',rptdate);
    search_params.set('rptend',rptend);
    url.search = search_params.toString();

    var new_url = url.toString();
    //console.log(new_url);
    let rawDataJson = await fetch(new_url)
        .then(res => res.json());

    var queriedData = [];
    //console.log(rawDataJson);
    if (dataKind == "turb") {
        queriedData = getTurbMean(rawDataJson);
    } else if (dataKind == "temp") {
        queriedData = getTurbTemp(rawDataJson);
    }
    
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

// get the inputted time from the turb/flow form
var turbMeanForm = document.querySelector("#turb-mean-form-info");

if (turbMeanForm){
    turbMeanForm.addEventListener("submit", function (event) {
        // stop form submission
        event.preventDefault();
        var fromTime = turbMeanForm.elements["from-time"].value.replace(/-/g,'');
        //console.log("fromTime: ", fromTime);
        var toTime = turbMeanForm.elements["to-time"].value.replace(/-/g,'');
        //console.log("toTime: ", toTime);
        MyTurbMeanChart.updateData(fromTime, toTime);

    });
}

// get the inputted time from the temperature form
var temperatureForm = document.querySelector("#temperature-form-info");

if (temperatureForm){
    temperatureForm.addEventListener("submit", function (event) {
        // stop form submission
        event.preventDefault();
        var fromTime = temperatureForm.elements["from-time"].value.replace(/-/g,'');
        //console.log("fromTime: ", fromTime);
        var toTime = temperatureForm.elements["to-time"].value.replace(/-/g,'');
        //console.log("toTime: ", toTime);
        MyTemperatureChart.updateData(fromTime, toTime);
    });
}

// Turbity Mean chart component
var MyTurbMeanChart = {
    initHighCharts: function() {
        this.chart = new Highcharts.chart('turb-container', {
            chart: {
                zoomType: 'x'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            title: {
                text: 'Stream Turbity Mean'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Turbity Mean'
                }
            },
            plotOptions: {
                area: {
                    fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                    },
                    marker: {
                    radius: 2
                    },
                    lineWidth: 1,
                    states: {
                    hover: {
                        lineWidth: 1
                    }
                    },
                    threshold: null
                }, 
                
            },
            series: [
                {
                    name: 'Kelsey',
                    data: [],
                    selected: true
                },
                {
                    name: 'Middle',
                    data: [],
                    selected: true
                },
                {
                    name: 'Scotts',
                    data: [],
                    selected: true
                }
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
    async updateData(rptdate,rptend) {
        this.chart.showLoading();
        for (let id = 1; id < 4; id++) {
            let dataFromGet = await asyncGetData(id,rptdate,rptend,"turb");
            //console.log("data from get ", dataFromGet);            
            this.chart.hideLoading();
            this.chart.series[id-1].setData(dataFromGet);
        }        
    },
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
        
            plotOptions: {
                area: {
                    fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                    },
                    marker: {
                    radius: 2
                    },
                    lineWidth: 1,
                    states: {
                    hover: {
                        lineWidth: 1
                    }
                    },
                    threshold: null
                }, 
                
            },
        
            series: [
                {
                    name: 'Kelsey',
                    data: [],
                    selected: true
                },
                {
                    name: 'Middle',
                    data: [],
                    selected: true
                },
                {
                    name: 'Scotts',
                    data: [],
                    selected: true
                }
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
    async updateData(rptdate,rptend) {
        this.chart.showLoading();
        for (let id = 1; id < 4; id++) {
            let dataFromGet = await asyncGetData(id,rptdate,rptend,"temp");
            //console.log("data from get temp", dataFromGet);            
            this.chart.hideLoading();
            this.chart.series[id-1].setData(dataFromGet);
        }        
    },
}
  

function main() {
    var currentTime = getCurrentTime();
    var lastWeekDate = getPreviousWeekDate();
    // will show a graph of current week's data when page first loads
    MyTurbMeanChart.initHighCharts();
    MyTurbMeanChart.updateData(lastWeekDate, currentTime);
    MyTemperatureChart.initHighCharts();
    MyTemperatureChart.updateData(lastWeekDate, currentTime);
}

main();
 