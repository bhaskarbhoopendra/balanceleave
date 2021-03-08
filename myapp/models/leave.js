const _ = require('underscore');
const DATA_DATE_FORMAT = 'DD-MMM-YYYY';
const allEmps = require('../data/employee').employee;
const im = require('../data/bizType').im;
const ce = require('../data/bizType').ce;
const m = require('moment');

const splitEmpBasedOnEligibility = (endDate) => {    
    const partitionToEligibleAndNonEligible = _.groupBy(allEmps, x => m(x.joinDate,DATA_DATE_FORMAT).isSameOrBefore(endDate));
    return [partitionToEligibleAndNonEligible.true || [], partitionToEligibleAndNonEligible.false || []];
}

const handleNonEligibileEmp = (nonEligibleEmp) => {
    return nonEligibleEmp.map(x => {
        return {...x, slcl:'NA', pl:'NA', total: 'NA'};
    });
}

const handleEligibleEmp = (eligibleEmp, endDate) => {
    return eligibleEmp.map(emp => emp.bizType === 'IM' ? handleIMEmp(emp, endDate) : handleCEEmp(emp, endDate));
}

const handleIMEmp = (emp, endDate) => {   
     
    const jd = m(emp.joinDate, DATA_DATE_FORMAT);   
    const qData = getIMEligiblieQuarter(jd);
    const fullQuarters = getFullQuarters(endDate, jd);
    const result = {...emp, slcl: qData.slcl + fullQuarters * 3, pl: qData.pl + fullQuarters * 4};
    result.total = result.slcl + result.pl;
    return result;
}

const getIMEligiblieQuarter = (jd) => {
    const eligibleQuarter = im.filter(q => q.quarter === jd.quarter()).filter(ed => {
        const year = jd.format('YYYY');
        return m(`${ed.from}-${year}`,DATA_DATE_FORMAT).isSameOrBefore(jd) && m(`${ed.to}-${year}`,DATA_DATE_FORMAT).isSameOrAfter(jd);
    });
    if(eligibleQuarter.length > 0){
        return eligibleQuarter[0];
    }
    return {slcl:0, pl:0};
}

const getCEEligiblieQuarter = (jd) => {
    console.log('JD', jd, jd.date());
    const eligibleQuarter = ce.filter(d => jd.date() >= d.from  && jd.date() <= d.to);
    if(eligibleQuarter.length > 0){
        return eligibleQuarter[0];
    }
    return {slcl:0, pl:0};
}

const getFullQuarters = (endDate, jd) => {
    return endDate.endOf('quarter').diff(jd.endOf('quarter'),'months')/3;
   
}


const getMonths = (endDate, jd) => {
    console.log(jd.endOf('month').add(1,'seconds'))
    return endDate.endOf('month').diff(jd.endOf('month').add(1,'seconds'),'months');
}

const handleCEEmp = (emp, endDate) => {
    const jd = m(emp.joinDate, DATA_DATE_FORMAT);   
    const qData = getCEEligiblieQuarter(jd);
    const fullQuarters = getMonths(endDate, jd);
    console.log(fullQuarters, emp);
    let result = {...emp, slcl: qData.slcl + fullQuarters * 1, pl: qData.pl + fullQuarters * 1.25};
    result.total = result.slcl + result.pl;
    return result;
}

module.exports.splitEmpBasedOnEligibility = splitEmpBasedOnEligibility;
module.exports.handleNonEligibileEmp = handleNonEligibileEmp;
module.exports.handleEligibleEmp = handleEligibleEmp;