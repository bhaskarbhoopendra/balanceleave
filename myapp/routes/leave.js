let express = require('express');
let router = express.Router();
const validator = require('../validators/leave');
const model = require('../models/leave');
const INPUT_DATE_FORMAT = 'YYYYMMDD';
const m = require('moment');
const axios = require('axios');

/**
 * Get the leave balance & takes end date as input to calculate leave balance
 */
router.get('/balance/:enddate', function(req, res) {
    const endDate = req.params.enddate;
    const valid = validator.isValidEndDate(endDate, INPUT_DATE_FORMAT);
    if(!valid.success){
        return res.json(valid);
    }
    const mEndDate = m(endDate, INPUT_DATE_FORMAT);
    const [eligibleEmp, nonEligibleEmp] = model.splitEmpBasedOnEligibility(endDate, mEndDate);
    res.json({success:true, reports: [...model.handleEligibleEmp(eligibleEmp, mEndDate), ...model.handleNonEligibileEmp(nonEligibleEmp, mEndDate)]});
});



module.exports = router;
