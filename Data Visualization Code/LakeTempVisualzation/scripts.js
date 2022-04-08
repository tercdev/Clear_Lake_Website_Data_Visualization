

var form = document.querySelector("#turb-mean-form-info");
var fromTime = "20190323";
var toTime = "20210907";


makeChart(fromTime,toTime);

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fromTime = form.elements["from-time"].value.replace(/-/g,'');
        toTime = form.elements["to-time"].value.replace(/-/g,'');
        makeChart(fromTime,toTime);
    })
}
function makeChart(fromDate,toDate) {
    var fromYear = Number(fromDate.substring(0,4));
    var fromMonth = Number(fromDate.substring(4,6));
    var fromDay = Number(fromDate.substring(6));
    var toYear = Number(toDate.substring(0,4));
    var toMonth = Number(toDate.substring(4,6));
    var toDay = Number(toDate.substring(6));
Highcharts.chart('container', {

    data: {
      //csvURL: 'Users/kennethlieu/Desktop/ECS/temperatures.csv'
      csvURL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmVKAPmOSZ_7jeBCMfZ6WWQYK80QD6_mrqZgCe6NCcOWrGoRGeLCmjVVX9rekBnFkK_Ii-tzhmOa2h/pub?output=csv'
    },
  
    chart: {
      type: 'heatmap'
    },
  
    boost: {
      useGPUTranslations: true
    },
  
    title: {
      text: 'Lake Temperature - UA-06 (3/23/2019 - 9/7/2021)',
      align: 'left',
      x: 40
    },
  
    subtitle: {
      text: 'Temperature variation by date and hour',
      align: 'left',
      x: 40
    },
  
    xAxis: {
      type: 'datetime',
      min: Date.UTC(fromYear, fromMonth-1,fromDay, 12, 0, 0),
      max: Date.UTC(toYear, toMonth-1, toDay, 11, 59, 59),
      labels: {
        align: 'left',
        x: 5,
        y: 14,
        format: '{value:%B}' // long month
      },
      showLastLabel: false,
      tickLength: 16
    },
  
    yAxis: {
      title: {
        text: null
      },
      labels: {
        format: '{value}'
      },
      minPadding: 0,
      maxPadding: 0,
      startOnTick: false,
      endOnTick: false,
      tickPositions: [0,2,4,6,8,10,12],
      tickWidth: 1,
      min: 0,
      max: 12,
      reversed: false
    },

 
  
    colorAxis: {
      stops: [
        [0, '#3060cf'],
        [0.5, '#fffbbc'],
        [0.9, '#c4463a'],
        [1, '#c4463a']
      ],
      min: 5,
      max: 30,
      startOnTick: false,
      endOnTick: false,
      labels: {
        format: '{value}℃'
      }
    },
  
    series: [{
      boostThreshold: 100,
      borderWidth: 0,
      nullColor: '#EFEFEF',
      colsize: 24 * 36e5, // one day
      tooltip: {
        headerFormat: 'Temperature<br/>',
        pointFormat: 'Date = {point.x:%e %b %Y %k:30}, Height = {point.y}m,  <b>{point.value} ℃</b>'
      },
      turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
    }]
  
  });
}

/*
var path = '/Users/kennethlieu/Desktop/ECS/temperatures.csv'
getData();

async function getData() {
  const response = await fetch(path);
  const data = await response.text();
  console.log(data);
}
*/