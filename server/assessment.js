var db = require('./pghelper'),
    winston = require('winston');


function findById(id) {
    // Retrieve offer either by Salesforce id or Postgress id
    return db.query('select id,sfId,Childs_Initials__c as childsInitials,Birthdate__c as birthdate,gender__c as gender ,Child_currently_at_risk__c as currentlyAtRisk,child__c as asdetect_contact,externalchildid__c as externalchildid from salesforce.mch_child_Asdetect__c WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
};

function getAll(req, res, next) { 
    var externalUserId = req.externalUserId;
    db.query("select c.id,c.sfid,c.name, c.consultation_date__c as consultationdate,c.record_type__c as recordtype,c.mch_child_asdetect__r__externalchildid__c as externalchildid, c.mch_child_asdetect__c,c.at_risk__c as atrisk from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c=$1",[externalUserId]) 
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
