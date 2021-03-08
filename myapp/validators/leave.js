const m = require('moment');

const isValidEndDate = (endDate, format) => {
    const mEndDate = m(endDate, format);
    if(endDate.length !== 8 || !mEndDate.isValid() || mEndDate.year() <= 1900){
        console.log('Invalid End date ', endDate);
        return {
            success:false, 
            msg: 'Invalid date format should be YYYYMMDD & year greater than 1900'
        };
    }
    return {
        success:true
    };
}

module.exports.isValidEndDate = isValidEndDate;

//Passing invalid date
console.log(isValidEndDate('00000000', 'YYYYMMDD').success === false);

//Passing invalid year
console.log(isValidEndDate('00010101', 'YYYYMMDD').success === false);

//Passing invalid month
console.log(isValidEndDate('20001301', 'YYYYMMDD').success === false);

//Passing invalid day
console.log(isValidEndDate('20001000', 'YYYYMMDD').success === false);

//Passing invalid format
console.log(isValidEndDate('20-Feb-2020', 'YYYYMMDD').success === false);