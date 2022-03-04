

var form = document.querySelector("#turb-mean-form-info");
var fromTime = "20190323";
var toTime = "20210907";

makeChart(fromTime, toTime);

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fromTime = form.elements["from-time"].value.replace(/-/g,'');
        toTime = form.elements["to-time"].value.replace(/-/g,'');
        makeChart(fromTime, toTime);
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
      csvURL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkkVTHrk3eRr_EL9ImqyBee0sl_dT_FYn_QZGBN2-oyrJVyE8NO-4IYWRHIinDpOemoUZaKxh72bl-/pub?output=csv"
    },
  
    chart: {
      type: 'heatmap'
    },
  
    boost: {
      useGPUTranslations: true
    },
  
    title: {
      text: 'Dissolved Oxygen - UA-06 (3/23/2019 - 9/7/2021)',
      align: 'left',
      x: 40
    },
  
    subtitle: {
      text: 'Dissolved oxygen time series by date and hour',
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
      maxPadding: 10,
      startOnTick: false,
      endOnTick: false,
      tickPositions: [0,1,2,3,4,5],
      tickWidth: 1,
      min: 0,
      max: 5,
      reversed: false
    },

 
  
    colorAxis: {
      stops: [
        [0, '#3060cf'],
        [0.5, '#fffbbc'],
        [0.9, '#c4463a'],
        [1, '#c4463a']
      ],
      min: 0,
      max: 13,
      startOnTick: false,
      endOnTick: false,
      labels: {
        format: '{value}mg/L'
      }
    },
  
    series: [{
      boostThreshold: 100,
      borderWidth: 0,
      nullColor: '#EFEFEF',
      colsize: 24 * 36e5, // one day
      tooltip: {
        headerFormat: 'Temperature<br/>',
        pointFormat: 'Date = {point.x:%e %b %Y %k:30}, Height = {point.y}m,  <b>{point.value} mg/L</b>'
      },
      turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
    }]
  
  });
}