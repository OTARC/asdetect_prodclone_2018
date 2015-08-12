var db = require('./pghelper'),
 config = require('./config'),
    winston = require('winston');


function findById(externalUserId,id) {
    // Retrieve offer either by Salesforce id or Postgress id
    return db.query('select c.id,c.sfid,c.name, c.consultation_date__c,c.record_type__c ,c.mch_child_asdetect__r__externalchildid__c as externalchildid, c.mch_child_asdetect__c,c.at_risk__c from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c=$1 and ' + (isNaN(id) ? 'c.sfId' : 'c.id') + '=$2', [externalUserId,id], true);
};

function getAll(req, res, next) { 
    var externalUserId = req.externalUserId;
    db.query("select c.id,c.sfid,c.name, c.consultation_date__c,c.record_type__c,c.mch_child_asdetect__r__externalchildid__c as externalchildid, c.mch_child_asdetect__c,c.at_risk__c from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c=$1",[externalUserId]) 
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

    
    //var recordtypeid='012j0000000mFHuAAM'; -- moved to config
    var recordtypeid=config.asdetect.recordType12M;

    //calculate at risk - TODO make this more robust
    var externalatrisk__c=0;
    var no_of_atypical_key_items=( (pointing__c=='Atypical'? 1:0) + (does_child_make_eye_contact_with_you__c=='Atypical'? 1: 0) +  (waves_bye_bye__c=='Atypical'? 1:0)  + (imitation__c=='Atypical'? 1:0)   + (responds_to_name__c=='Atypical'? 1:0)   );
    
    if (no_of_atypical_key_items>=3) {
        externalatrisk__c='Yes';
    } 
    else {
        externalatrisk__c='No';
    }
    console.log('Calculated external at risk:' + externalatrisk__c + ':count is '+ no_of_atypical_key_items);

    

    console.log(JSON.stringify(req.body));
        
            db.query('insert into salesforce.consultation_asdetect__c (recordtypeid,consultation_date__c,mch_child_asdetect__r__externalchildid__c ,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, conversational_babble__c,says_1_3_clear_words__c, understands_obeys_simple_instructions__c, attending_to_sounds__c,externalatrisk__c) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', [recordtypeid,consultation_date__c,externalchildid,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, conversational_babble__c,says_1_3_clear_words__c, understands_obeys_simple_instructions__c, attending_to_sounds__c,externalatrisk__c], true)
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
