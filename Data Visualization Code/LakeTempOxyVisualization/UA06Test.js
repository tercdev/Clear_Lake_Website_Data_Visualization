var fromTime = "20190323";
var toTime = "20220204";

//UA06 endpoints
fetch('https://f6axabo7w6.execute-api.us-west-2.amazonaws.com/default/clearlake-lakeoxygen?id=5&start=20190323&end=20220204')
    .then(result => result.json())
    .then((output) => {
        init(output);
        
}).catch(err => console.error(err));

//arrC array
arrC = [];

var form2 = document.querySelector("#turb-mean-form-info2");

//initialize arr + interpolation
function init(arr) {
    for (let i = 0; i < arr.length; i++) { 
        let val48 = parseFloat(arr[i]['Height_4.8m']);
        let val2 = parseFloat(arr[i]['Height_2m']);
        let val05 = parseFloat(arr[i]['Height_0.5m'])

        //interpolation for 4m 
        let val4 = (((4-2)/(4.8-2)) * (val48-val2)) + val2;
        //interpolation for 3m
        let val3 = (((3-2)/(4.8-2)) * (val48-val2)) + val2;

        //interpolation for 1m
        let val1 = (((1-0.5)/(2-0.5)) * (val2-val05)) + val05;

        //round the interpolated data to nearest hundredth
        val4 = (Math.round(val4*100)/100);
        val3 = (Math.round(val3*100)/100);
        val1 = (Math.round(val1*100)/100);

        //array of three values [date,depth,oxygen]
        let arr1 = [arr[i]["DateTime_UTC"],4.8,val48];
        let arr2 = [arr[i]["DateTime_UTC"],4,val4];
        let arr3 = [arr[i]["DateTime_UTC"],3,val3];
        let arr4 = [arr[i]["DateTime_UTC"],2,val2];
        let arr5 = [arr[i]["DateTime_UTC"],1,val1];
        let arr6 = [arr[i]["DateTime_UTC"],0.5,val05];

        //push the arrays into arrC
        arrC.push(arr1);
        arrC.push(arr2);
        arrC.push(arr3);
        arrC.push(arr4);
        arrC.push(arr5);
        arrC.push(arr6);

    }
}
