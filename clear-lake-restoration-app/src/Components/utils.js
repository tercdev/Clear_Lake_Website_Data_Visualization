/**
 * Converts a Date object into a string of the format YYYYMMDD
 * @param {Date} date 
 * @returns {String}
 */
export function convertDate(date) {
    let year = date.getFullYear().toString();
    let month = (date.getMonth()+1).toString();
    let day = date.getDate().toString();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return year+month+day;
}

/**
 * Converts a date from GMT to PST
 * @param {Date} date in GMT
 * @returns {Date} in PST
 */
export function convertGMTtoPSTTime (date) {
    // reference: https://stackoverflow.com/questions/22493924/get-user-time-and-convert-them-to-pst
    // var offset = 420; 
    // var offsetMillis = offset * 60 * 1000;
    var today = date;
    // var millis = today.getTime();
    var timeZoneOffset = (today.getTimezoneOffset() * 60 * 1000);

    // var pst = millis - offsetMillis; 
    return new Date(today.getTime() - timeZoneOffset);
}

/**
 * Conversion from direction to a number
 * @param {*} direction 
 * @returns {number} wind direction in degrees
 */
export function cardinalToDeg(direction) {
    if (!isNaN(parseFloat(direction))) {
        return parseFloat(direction)
    }
    if (direction === 'N') {
        return 360
    };
    if (direction === 'NNE') {
        return 22.5
    };
    if (direction === 'NE') {
        return 45
    };
    if (direction === 'ENE') {
        return 67.5
    };
    if (direction === 'E') {
        return 90
    };
    if (direction === 'ESE') {
        return 112.5
    };
    if (direction === 'SE') {
        return 135
    };
    if (direction === 'SSE') {
        return 157.5
    };
    if (direction === 'S') {
        return 180
    };
    if (direction === 'SSW') {
        return 202.5
    };
    if (direction === 'SW') {
        return 225
    };
    if (direction === 'WSW') {
        return 247.5
    };
    if (direction === 'W') {
        return 270
    };
    if (direction === 'WNW') {
        return 292.5
    };
    if (direction === 'NW') {
        return 315
    };
    if (direction === 'NNW') {
        return 337.5
    };

    return 0 // direction == '---'
}

/**
 * remove all the data where the time is before `date`
 * @param {Array} data 
 * @param {number} date time in milliseconds
 * @returns {Array}
 */
export function removePast(data, date) {
    if (date === undefined) {
        return data;
    }
    let i = 0;
    while (data[i][0] <= date) {
        data.shift();
    }
    return data;
}

/**
 * remove all the data where the time is after `lastDate`
 * @param {Array} data 
 * @param {number} lastDate time in milliseconds
 * @returns {Array}
 */
export function removeExcess(data, lastDate) {
    if (lastDate === undefined) {
        return data;
    }

    for (let i = data.length - 1; i >= 0; i--){
        for (let j = data[i].length - 2; j >= 0; j--) {
            if (new Date(data[i][j]["DateTime_UTC"]).getTime() > lastDate) {
                data[i].splice(j,1)
            }
        }
    }

    return data;
}