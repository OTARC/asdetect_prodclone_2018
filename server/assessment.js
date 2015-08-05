var db = require('./pghelper'),
    winston = require('winston');


function findById(id) {
    // Retrieve offer either by Salesforce id or Postgress id
    return db.query('select id,sfId,Childs_Initials__c as childsInitials,Birthdate__c as birthdate,gender__c as gender ,Child_currently_at_risk__c as currentlyAtRisk,child__c as asdetect_contact,externalchildid__c as externalchildid from salesforce.mch_child_Asdetect__c WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
};

function getAll(req, res, next) { 
    var externalUserId = req.externalUserId;
    db.query('select id,sfid,name, consultation_date__c as consultationdate,record_type__c as recordtype,mch_child_asdetect__r__externalchildid__c as externalchildid, mch_child_asdetect__c ,at_risk__c as atrisk from salesforce.consultation_asdetect__c') 
        .then(function (assessment) {
            return res.send(JSON.stringify(assessment));
        })
        .catch(next);
};


function getById(req, res, next) {
    var id = req.params.id;
    findById(id)
        .then(function (assessment) {
            console.log(JSON.stringify(assessment));
            return res.send(JSON.stringify(assessment));
        })
        .catch(next);
};


exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
