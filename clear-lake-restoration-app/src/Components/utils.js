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