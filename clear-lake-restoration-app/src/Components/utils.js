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

export function subDays(date, num) {
    return new Date(new Date().setDate(date.getDate() - num));
}

export function addDays(date, num, compareDate) {
    let x = new Date(new Date().setDate(date.getDate() + num));
    if (compareDate < x) {
        return compareDate
    } else {
        return x
    }
}
export function convertGMTtoPSTTime (date) {
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
export function cardinalToDeg(direction) {
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

export function removePast(data, date) {
    if (date == undefined) {
        return data;
    }
    let i = 0;
    while (data[i][0] <= date) {
        data.shift();
    }
    return data;
}