const x = [];
const y = [];
var tab = [];
var tab1 = [];
var tab2 = [];
var tab3 = [];
var tab4 = [];
var response = "";
var data = "";
var sortedD = [];
var sortedD1 = [];
var sortedD2 = [];
var sortedD3 = [];
var sortedD4 = [];

var fileName = "UA01Mar-18-2019";
var visuals = "Temp";
function dynamicdropdown(listindex)
    {
        switch (listindex)
        {
        case "UA01" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-18-2019","Mar-18-2019");
            document.getElementById("status").options[2]=new Option("Apr-12-2019","Apr-12-2019");
            document.getElementById("status").options[3]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[4]=new Option("Jun-13-2019","Jun-13-2019");
            document.getElementById("status").options[5]=new Option("Jul-10-2019","Jul-10-2019");
            document.getElementById("status").options[6]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[7]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[8]=new Option("Oct-07-2019","Oct-07-2019");
            document.getElementById("status").options[9]=new Option("Oct-11-2019","Oct-11-2019");
            document.getElementById("status").options[10]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[11]=new Option("Sep-08-2020","Sep-08-2020");
            document.getElementById("status").options[12]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[13]=new Option("Oct-16-2020","Oc-16-2020");
            document.getElementById("status").options[14]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[15]=new Option("Jan-15-2021","Jan-15-2021");
            document.getElementById("status").options[16]=new Option("Jan-23-2021","Jan-23-2021");
            document.getElementById("status").options[17]=new Option("Mar-13-2021","Mar-13-2021");
            document.getElementById("status").options[18]=new Option("Apr-23-2021","Apr-23-2021");
            document.getElementById("status").options[19]=new Option("May-04-2021","May-04-2021");
            document.getElementById("status").options[20]=new Option("Jun-10-2021","Jun-10-2021");
            document.getElementById("status").options[21]=new Option("Jul-10-2021","Jul-10-2021");
            document.getElementById("status").options[22]=new Option("Jul-22-2021","Jan-22-2021");
            break;
        case "UA06" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-18-2019","Mar-18-2019");
            document.getElementById("status").options[2]=new Option("Mar-19-2019","Mar-19-2019");
            document.getElementById("status").options[3]=new Option("Apr-12-2019","Apr-12-2019");
            document.getElementById("status").options[4]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[5]=new Option("Jun-12-2019","Jun-12-2019");
            document.getElementById("status").options[6]=new Option("Jul-10-2019","Jul-10-2019");
            document.getElementById("status").options[7]=new Option("Jul-12-2019","Jul-12-2019");
            document.getElementById("status").options[8]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[9]=new Option("Jul-29-2019","Jul-29-2019");
            document.getElementById("status").options[10]=new Option("Aug-25-2019","Aug-25-2019");
            document.getElementById("status").options[11]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[12]=new Option("Oct-07-2019","Oct-07-2019");
            document.getElementById("status").options[13]=new Option("Oct-11-2019","Oct-11-2019");
            document.getElementById("status").options[14]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[15]=new Option("Aug-18-2019","Aug-18-2019");
            document.getElementById("status").options[16]=new Option("Sep-08-2020","Sep-08-2020");
            document.getElementById("status").options[17]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[18]=new Option("Oct-16-2020","Oc-16-2020");
            document.getElementById("status").options[19]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[20]=new Option("Jan-15-2021","Jan-15-2021");
            document.getElementById("status").options[21]=new Option("Jan-23-2021","Jan-23-2021");
            document.getElementById("status").options[22]=new Option("Mar-13-2021","Mar-13-2021");
            document.getElementById("status").options[23]=new Option("Apr-23-2021","Apr-23-2021");
            document.getElementById("status").options[24]=new Option("May-04-2021","May-04-2021");
            document.getElementById("status").options[25]=new Option("Jun-10-2021","Jun-10-2021");
            document.getElementById("status").options[26]=new Option("Jul-10-2021","Jul-10-2021");
            document.getElementById("status").options[27]=new Option("Jul-22-2021","Jan-22-2021");
            break;
        case "UA07" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-18-2019","Mar-18-2019");
            document.getElementById("status").options[2]=new Option("Apr-12-2019","Apr-12-2019");
            document.getElementById("status").options[3]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[4]=new Option("Jun-11-2019","Jun-11-2019");
            document.getElementById("status").options[5]=new Option("Jul-12-2019","Jul-12-2019");
            document.getElementById("status").options[6]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[7]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[8]=new Option("Oct-08-2019","Oct-08-2019");
            document.getElementById("status").options[9]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[10]=new Option("Sep-08-2020","Sep-08-2020");
            document.getElementById("status").options[11]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[12]=new Option("Oct-16-2020","Oc-16-2020");
            document.getElementById("status").options[13]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[14]=new Option("Jan-15-2021","Jan-15-2021");
            document.getElementById("status").options[15]=new Option("Mar-13-2021","Mar-13-2021");
            break;
        case "UA08" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-18-2019","Mar-18-2019");
            document.getElementById("status").options[2]=new Option("Apr-12-2019","Apr-12-2019");
            document.getElementById("status").options[3]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[4]=new Option("Jun-12-2019","Jun-12-2019");
            document.getElementById("status").options[5]=new Option("Jul-10-2019","Jul-10-2019");
            document.getElementById("status").options[6]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[7]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[8]=new Option("Oct-08-2019","Oct-08-2019");
            document.getElementById("status").options[9]=new Option("Oct-11-2019","Oct-11-2019");
            document.getElementById("status").options[10]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[11]=new Option("Sep-08-2020","Sep-08-2020");
            document.getElementById("status").options[12]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[13]=new Option("Oct-16-2020","Oc-16-2020");
            document.getElementById("status").options[14]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[15]=new Option("Jan-15-2021","Jan-15-2021");
            document.getElementById("status").options[16]=new Option("Jan-23-2021","Jan-23-2021");
            document.getElementById("status").options[17]=new Option("Mar-13-2021","Mar-13-2021");
            document.getElementById("status").options[18]=new Option("Apr-23-2021","Apr-23-2021");
            document.getElementById("status").options[19]=new Option("May-04-2021","May-04-2021");
            document.getElementById("status").options[20]=new Option("Jun-10-2021","Jun-10-2021");
            document.getElementById("status").options[21]=new Option("Jul-10-2021","Jul-10-2021");
            document.getElementById("status").options[22]=new Option("Jul-22-2021","Jan-22-2021");
            break;
        case "LA03" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-19-2019","Mar-19-2019");
            document.getElementById("status").options[2]=new Option("Apr-12-2019","Apr-12-2019");
            document.getElementById("status").options[3]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[4]=new Option("Jun-14-2019","Jun-14-2019");
            document.getElementById("status").options[5]=new Option("Jul-09-2019","Jul-09-2019");
            document.getElementById("status").options[6]=new Option("Jul-12-2019","Jul-12-2019");
            document.getElementById("status").options[7]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[8]=new Option("Jul-29-2019","Jul-29-2019");
            document.getElementById("status").options[9]=new Option("Aug-25-2019","Aug-25-2019");
            document.getElementById("status").options[10]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[11]=new Option("Oct-06-2019","Oct-06-2019");
            document.getElementById("status").options[12]=new Option("Oct-11-2019","Oct-11-2019");
            document.getElementById("status").options[13]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[14]=new Option("Aug-18-2020","Aug-18-2020");
            document.getElementById("status").options[15]=new Option("Sep-08-2020","Sep-08-2020");
            document.getElementById("status").options[16]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[17]=new Option("Oct-16-2020","Oct-16-2020");
            document.getElementById("status").options[18]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[19]=new Option("Jan-15-2021","Jan-15-2021");
            document.getElementById("status").options[20]=new Option("Jan-23-2021","Jan-23-2021");
            document.getElementById("status").options[21]=new Option("Mar-13-2021","Mar-13-2021");
            document.getElementById("status").options[22]=new Option("Apr-23-2021","Apr-23-2021");
            document.getElementById("status").options[23]=new Option("May-04-2021","May-04-2021");
            document.getElementById("status").options[24]=new Option("Jun-10-2021","Jun-10-2021");
            document.getElementById("status").options[25]=new Option("Jul-10-2021","Jul-10-2021");
            document.getElementById("status").options[26]=new Option("Jul-22-2021","Jul-22-2021");
            break;
        case "NR02" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-19-2019","Mar-19-2019");
            document.getElementById("status").options[2]=new Option("Apr-12-2019","Apr-12-2019");
            document.getElementById("status").options[3]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[4]=new Option("Jun-13-2019","Jun-13-2019");
            document.getElementById("status").options[5]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[6]=new Option("Jul-29-2019","Jul-29-2019");
            document.getElementById("status").options[7]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[8]=new Option("Oct-07-2019","Oct-07-2019");
            document.getElementById("status").options[9]=new Option("Oct-11-2019","Oct-11-2019");
            document.getElementById("status").options[10]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[11]=new Option("Sep-08-2020","Sep-08-2020");
            document.getElementById("status").options[12]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[13]=new Option("Oct-16-2020","Oc-16-2020");
            document.getElementById("status").options[14]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[15]=new Option("Jan-15-2021","Jan-15-2021");
            document.getElementById("status").options[16]=new Option("Jan-23-2021","Jan-23-2021");
            document.getElementById("status").options[17]=new Option("Mar-13-2021","Mar-13-2021");
            document.getElementById("status").options[18]=new Option("Apr-23-2021","Apr-23-2021");
            document.getElementById("status").options[19]=new Option("May-04-2021","May-04-2021");
            document.getElementById("status").options[20]=new Option("Jun-10-2021","Jun-10-2021");
            document.getElementById("status").options[21]=new Option("Jul-10-2021","Jul-10-2021");
            document.getElementById("status").options[22]=new Option("Jul-22-2021","Jan-22-2021");
            break;
        case "OA04" :
            document.getElementById("status").options[0]=new Option("Select date","");
            document.getElementById("status").options[1]=new Option("Mar-19-2019","Mar-19-2019");
            document.getElementById("status").options[2]=new Option("Jun-09-2019","Jun-09-2019");
            document.getElementById("status").options[3]=new Option("Jun-14-2019","Jun-14-2019");
            document.getElementById("status").options[4]=new Option("Jul-09-2019","Jul-09-2019");
            document.getElementById("status").options[5]=new Option("Jul-12-2019","Jul-12-2019");
            document.getElementById("status").options[6]=new Option("Jul-13-2019","Jul-13-2019");
            document.getElementById("status").options[7]=new Option("Aug-25-2019","Aug-25-2019");
            document.getElementById("status").options[8]=new Option("Aug-31-2019","Aug-31-2019");
            document.getElementById("status").options[9]=new Option("Oct-06-2019","Oct-06-2019");
            document.getElementById("status").options[10]=new Option("Oct-11-2019","Oct-11-2019");
            document.getElementById("status").options[11]=new Option("Jul-22-2020","Jul-22-2020");
            document.getElementById("status").options[12]=new Option("Aug-18-2019","Aug-18-2019");
            document.getElementById("status").options[13]=new Option("Oct-10-2020","Oct-10-2020");
            document.getElementById("status").options[14]=new Option("Oct-16-2020","Oc-16-2020");
            document.getElementById("status").options[15]=new Option("Dec-04-2020","Dec-04-2020");
            document.getElementById("status").options[16]=new Option("Jan-23-2021","Jan-23-2021");
            document.getElementById("status").options[17]=new Option("Mar-13-2021","Mar-13-2021");
            document.getElementById("status").options[18]=new Option("Apr-23-2021","Apr-23-2021");
            document.getElementById("status").options[19]=new Option("May-04-2021","May-04-2021");
            document.getElementById("status").options[20]=new Option("Jun-10-2021","Jun-10-2021");
            document.getElementById("status").options[21]=new Option("Jul-10-2021","Jul-10-2021");
            document.getElementById("status").options[22]=new Option("Jul-22-2021","Jan-22-2021");
            break;
        }
        
        return true;
    }
function update() {
    sortedD.length = 0;
    tab.length = 0;
    sortedD1.length = 0;
    tab1.length = 0;
    sortedD2.length = 0;
    tab2.length = 0;
    sortedD3.length = 0;
    tab3.length = 0;
    sortedD4.length = 0;
    tab4.length = 0;
    var select = document.getElementById('sites');
    var text = select.options[select.selectedIndex].text;
    fileName = text;
}

function updateDate() {
    sortedD.length = 0;
    tab.length = 0;
    sortedD1.length = 0;
    tab1.length = 0;
    sortedD2.length = 0;
    tab2.length = 0;
    sortedD3.length = 0;
    tab3.length = 0;
    sortedD4.length = 0;
    tab4.length = 0;
    fileName = document.getElementById('sites').options[document.getElementById('sites').selectedIndex].text;
    var sel = document.getElementById('status');
    fileName = fileName + sel.options[sel.selectedIndex].text;
    getChart();
}

function update1() {
    sortedD.length = 0;
    tab.length = 0;
    sortedD1.length = 0;
    tab1.length = 0;
    sortedD2.length = 0;
    tab2.length = 0;
    sortedD3.length = 0;
    tab3.length = 0;
    sortedD4.length = 0;
    tab4.length = 0;
    var selected = document.getElementById('visuals');
    var texted = selected.options[selected.selectedIndex].text;
    visuals = texted;
    getChart();
}

async function getChart() {
    await getData();
    var data1 = [];
    var name1 = "";
    if (visuals.localeCompare("Temp") == 0) {
        data1 = sortedD;
        name1 = "Temperature (deg Celsius) ";
    } else if (visuals.localeCompare("Special Conductivity") == 0) {
        data1 = sortedD1;
        name1 = "Special Conductivity (uS/cm) ";
    } else if (visuals.localeCompare("Chlorophyll") == 0) {
        data1 = sortedD2;
        name1 = "Chlorophyll (ug/L) ";
    } else if (visuals.localeCompare("Turbidity") == 0) {
        data1 = sortedD3;
        name1 = "Turbidity (FTU) ";
    } else {
        data1  = sortedD4;
        name1 = "Dissolved Oxygen (mg/L)";
    }
    $(function () {
        $('#container').highcharts({
            chart:{
                type:'scatter'
                
            },
            title: {
                text: "Profile Data Visualization by depth(m)"
            },
            yAxis: {
                title: {
                    text: 'Depth (m)'
                }
            },
            xAxis: {
                title: {
                    text: name1
                }
            },
            plotOptions:{
                scatter:{
                    lineWidth:1
                },
                series: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2
                    },
                    title: {
                        text: name1
                    }
                }
            },
            series: [{
                name: name1,
                data: data1
            }]
        });
    });
}
async function getData() {
    response = await fetch(fileName + ".csv");
    data = await response.text();
    const table = data.split('\n').slice(1);
table.forEach(row => {
    const col = row.split(',');
    const depth = col[2];
    var ele = [];
    var ele1 = [];
    var ele2 = [];
    var ele3 = [];
    var ele4 = [];
    ele.push(parseFloat(col[3]));
    ele.push(parseFloat(depth));
    ele1.push(parseFloat(col[4]));
    ele1.push(parseFloat(depth));
    ele2.push(parseFloat(col[5]));
    ele2.push(parseFloat(depth));
    ele3.push(parseFloat(col[6]));
    ele3.push(parseFloat(depth));
    ele4.push(parseFloat(col[7]));
    ele4.push(parseFloat(depth));
    tab.push(ele);
    tab1.push(ele1);
    tab2.push(ele2);
    tab3.push(ele3);
    tab4.push(ele4);
})
sortedD = tab.sort((a,b) => b[0]-a[0]);
sortedD1 = tab1.sort((a,b) => b[0]-a[0]);
sortedD2 = tab2.sort((a,b) => b[0]-a[0]);
sortedD3 = tab3.sort((a,b) => b[0]-a[0]);
sortedD4 = tab4.sort((a,b) => b[0]-a[0]);
}

getChart();
dynamicdropdown("UA01");

