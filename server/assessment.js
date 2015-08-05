var db = require('./pghelper'),
    winston = require('winston');


function findById(externalUserId,id) {
    // Retrieve offer either by Salesforce id or Postgress id
    return db.query('select c.id,c.sfid,c.name, c.consultation_date__c as consultationdate,c.record_type__c as recordtype,c.mch_child_asdetect__r__externalchildid__c as externalchildid, c.mch_child_asdetect__c,c.at_risk__c as atrisk from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c=$1 and ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [externalUserId,id], true);
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
    var externalUserId = req.externalUserId;

    findById(externalUserId,id)
        .then(function (assessment) {
            console.log(JSON.stringify(assessment));
            return res.send(JSON.stringify(assessment));
        })
        .catch(next);
};


exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
