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


// add 12 month assessment
function create12mAssessment(req, res, next) {
    var externalUserId = req.externalUserId,
    externalchildid=req.body.externalchildid,
    consultation_date__c = req.body.consultation_date__c,
    pointing__c=req.body.pointing__c,
    does_child_make_eye_contact_with_you__c=req.body.does_child_make_eye_contact_with_you__c,
    waves_bye_bye__c=req.body.waves_bye_bye__c,
    imitation__c=req.body.imitation__c, 
    responds_to_name__c=req.body.responds_to_name__c,
    social_smile__c=req.body.social_smile__c, 
    conversational_babble__c=req.body.conversational_babble__c,
    says_1_3_clear_words__c=req.body.says_1_3_clear_words__c, 
    understands_obeys_simple_instructions__c=req.body.understands_obeys_simple_instructions__c, 
    attending_to_sounds__c=req.body.attending_to_sounds__c;
 

    console.log(JSON.stringify(req.body));
        
            db.query('INSERT INTO salesforce.mch_child_asdetect__c (asdetect_contact__c__loyaltyid__c, childs_initials__c,birthdate__c,gender__c,diagnosis__c,externalchildid__c) VALUES ($1, $2, $3, $4,$5,$6)', [externalUserId, childsinitials,birthdate,gender,diagnosis,externalchildid], true)

                .then(function () {
                    return res.send('ok');
                })
                .fail(function(err) {
                    return next(err);
                })
        .catch(next);

};


exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
exports.create12mAssessment=create12mAssessment;
