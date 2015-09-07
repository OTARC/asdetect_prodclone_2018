var db = require('./pghelper'),
 config = require('./config'),
 missingAssessmentInformation='One or more mandatory fields on Assessment is missing.',
 winston = require('winston');


function findById(externalUserId,id) {
    // Retrieve offer either by Salesforce id or Postgress id
    return db.query('select c.id,c.sfid,c.name, c.consultation_date__c,c.record_type__c ,c.mch_child_asdetect__r__externalchildid__c as externalchildid, c.mch_child_asdetect__c,c.at_risk__c,c.age_at_time_of_assessment_years_months__c from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c=$1 and ' + (isNaN(id) ? 'c.sfId' : 'c.id') + '=$2', [externalUserId,id], true);
};

function getAll(req, res, next) { 
    var externalUserId = req.externalUserId;
    db.query("select c.id,c.sfid,c.name, c.consultation_date__c,c.record_type__c,c.mch_child_asdetect__r__externalchildid__c as externalchildid, c.mch_child_asdetect__c,c.at_risk__c,c.age_at_time_of_assessment_years_months__c from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c=$1",[externalUserId]) 
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
    externalchildid__c=req.body.externalchildid__c,
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
    

//basic error checking

    if ((consultation_date__c==null) || 
        (pointing__c==null)||(does_child_make_eye_contact_with_you__c==null)  || 
        (waves_bye_bye__c==null) || 
        (imitation__c==null)||
        (responds_to_name__c==null)||
        (social_smile__c==null) ||
        (conversational_babble__c==null)||
    
        (says_1_3_clear_words__c==null)||
        (understands_obeys_simple_instructions__c==null)||
        (attending_to_sounds__c==null)
        
        ) {
        return res.send(400, missingAssessmentInformation);
}


    //var recordtypeid='012j0000000mFHuAAM'; -- moved to config
    var recordtypeid=config.asdetect.recordType12M;

    //calculate at risk - TODO make this more robust
    var externalatrisk__c='No';
    var no_of_atypical_key_items=( (pointing__c=='Atypical'? 1:0) + (does_child_make_eye_contact_with_you__c=='Atypical'? 1: 0) +  (waves_bye_bye__c=='Atypical'? 1:0)  + (imitation__c=='Atypical'? 1:0)   + (responds_to_name__c=='Atypical'? 1:0)   );
    
    if (no_of_atypical_key_items>=3) {
        externalatrisk__c='Yes';
    } 
    else {
        externalatrisk__c='No';
    }
    console.log('Calculated external at risk:' + externalatrisk__c + ':count is '+ no_of_atypical_key_items);

    

    console.log(JSON.stringify(req.body));
        
            db.query('insert into salesforce.consultation_asdetect__c (recordtypeid,consultation_date__c,mch_child_asdetect__r__externalchildid__c ,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, conversational_babble__c,says_1_3_clear_words__c, understands_obeys_simple_instructions__c, attending_to_sounds__c,externalatrisk__c) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', [recordtypeid,consultation_date__c,externalchildid__c,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, conversational_babble__c,says_1_3_clear_words__c, understands_obeys_simple_instructions__c, attending_to_sounds__c,externalatrisk__c], true)
                .then(function () {                   
                    return res.send('ok');
                })
                .fail(function(err) {
                    return next(err);
                })
        .catch(next);

};

// add 18 month assessment
function create18mAssessment(req, res, next) {
    var externalUserId = req.externalUserId,
    externalchildid__c=req.body.externalchildid__c,
    consultation_date__c = req.body.consultation_date__c,
    pointing__c=req.body.pointing__c,
    does_child_make_eye_contact_with_you__c=req.body.does_child_make_eye_contact_with_you__c,
    waves_bye_bye__c=req.body.waves_bye_bye__c,
    imitation__c=req.body.imitation__c, 
    responds_to_name__c=req.body.responds_to_name__c,
    social_smile__c=req.body.social_smile__c, 
    understands_obeys_simple_instructions__c=req.body.understands_obeys_simple_instructions__c, 
    showing__c=req.body.showing__c,
    pretend_play__c=req.body.pretend_play__c,
    follows_point__c=req.body.follows_point__c,
    uses_5_10_words__c=req.body.uses_5_10_words__c,
    understands_words__c=req.body.understands_words__c,
    points_to_facial_features__c=req.body.points_to_facial_features__c,
    loss_of_skills__c=req.body.loss_of_skills__c;

    

//basic error checking

    if ((consultation_date__c==null) || 
        (pointing__c==null)||
        (does_child_make_eye_contact_with_you__c==null)  || 
        (waves_bye_bye__c==null) || 
        (imitation__c==null)||
        (responds_to_name__c==null)||
        (social_smile__c==null) ||  
        (understands_obeys_simple_instructions__c==null)||
        (showing__c==null)||
        (pretend_play__c==null)||
        (follows_point__c==null)||
        (uses_5_10_words__c==null)||
        (understands_words__c==null)||
        (points_to_facial_features__c==null)||
        (loss_of_skills__c==null)
        
        ) {
        return res.send(400, missingAssessmentInformation);
}


    //var recordtypeid='012j0000000mFHuAAM'; -- moved to config
    var recordtypeid=config.asdetect.recordType18M;

    //calculate at risk - TODO make this more robust
    var externalatrisk__c='No';
    var no_of_atypical_key_items=( (pointing__c=='Atypical'? 1:0) + (does_child_make_eye_contact_with_you__c=='Atypical'? 1: 0) +  (waves_bye_bye__c=='Atypical'? 1:0)  + (imitation__c=='Atypical'? 1:0)   + (pretend_play__c=='Atypical'? 1:0)   );
    
   if (no_of_atypical_key_items>=3) {
        externalatrisk__c='Yes';
    } 
   else {
        externalatrisk__c='No';
    }
    console.log('Calculated external at risk:' + externalatrisk__c + ':count is '+ no_of_atypical_key_items);

    console.log(JSON.stringify(req.body));
        
            db.query('insert into salesforce.consultation_asdetect__c (recordtypeid,consultation_date__c,mch_child_asdetect__r__externalchildid__c ,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, understands_obeys_simple_instructions__c,showing__c,pretend_play__c,follows_point__c,uses_5_10_words__c,understands_words__c,points_to_facial_features__c,loss_of_skills__c,externalatrisk__c) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)', [recordtypeid,consultation_date__c,externalchildid__c,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, understands_obeys_simple_instructions__c,showing__c,pretend_play__c,follows_point__c,uses_5_10_words__c,understands_words__c,points_to_facial_features__c,loss_of_skills__c,externalatrisk__c], true)
                .then(function () {                   
                    return res.send('ok');
                })
                .fail(function(err) {
                    return next(err);
                })
        .catch(next);

};


function create24mAssessment(req, res, next) {
    var externalUserId = req.externalUserId,
    externalchildid__c=req.body.externalchildid__c,
    consultation_date__c = req.body.consultation_date__c,
    pointing__c=req.body.pointing__c,
    does_child_make_eye_contact_with_you__c=req.body.does_child_make_eye_contact_with_you__c,
    waves_bye_bye__c=req.body.waves_bye_bye__c,
    imitation__c=req.body.imitation__c, 
    responds_to_name__c=req.body.responds_to_name__c,
    social_smile__c=req.body.social_smile__c, 
    understands_obeys_simple_instructions__c=req.body.understands_obeys_simple_instructions__c, 
    showing__c=req.body.showing__c,
    pretend_play__c=req.body.pretend_play__c,
    follows_point__c=req.body.follows_point__c,
    loss_of_skills__c=req.body.loss_of_skills__c,
    uses_20_50_words__c=req.body.uses_20_50_words__c,
    two_word_utterances__c=req.body.two_word_utterances__c,
    parallel_play__c=req.body.parallel_play__c,
    interest_in_other_children__c=req.body.interest_in_other_children__c;




    

//basic error checking

    if ((consultation_date__c==null) || 
        (pointing__c==null)||
        (does_child_make_eye_contact_with_you__c==null)  || 
        (waves_bye_bye__c==null) || 
        (imitation__c==null)||
        (responds_to_name__c==null)||
        (social_smile__c==null) ||  
        (understands_obeys_simple_instructions__c==null)||
        (showing__c==null)||
        (pretend_play__c==null)||
        (follows_point__c==null)||
        (loss_of_skills__c==null)||
        (uses_20_50_words__c==null)||
        (two_word_utterances__c==null)||
        (parallel_play__c==null)||
        interest_in_other_children__c==null)
        
        ) {
        return res.send(400, missingAssessmentInformation);
}


    //var recordtypeid='012j0000000mFHuAAM'; -- moved to config
    var recordtypeid=config.asdetect.recordType24M;

    //calculate at risk - TODO make this more robust
    var externalatrisk__c='No';
    var no_of_atypical_key_items=( (pointing__c=='Atypical'? 1:0) + (does_child_make_eye_contact_with_you__c=='Atypical'? 1: 0) +  (waves_bye_bye__c=='Atypical'? 1:0)  + (imitation__c=='Atypical'? 1:0)   + (pretend_play__c=='Atypical'? 1:0)   );
    
   if (no_of_atypical_key_items>=3) {
        externalatrisk__c='Yes';
    } 
   else {
        externalatrisk__c='No';
    }
    console.log('Calculated external at risk:' + externalatrisk__c + ':count is '+ no_of_atypical_key_items);

    console.log(JSON.stringify(req.body));
        
            db.query('insert into salesforce.consultation_asdetect__c (recordtypeid,consultation_date__c,mch_child_asdetect__r__externalchildid__c ,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, understands_obeys_simple_instructions__c,showing__c,pretend_play__c,follows_point__c,loss_of_skills__c,uses_20_50_words__c,two_word_utterances__c,parallel_play__c,interest_in_other_children__c,externalatrisk__c) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)', [recordtypeid,consultation_date__c,externalchildid__c,pointing__c, does_child_make_eye_contact_with_you__c, waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, understands_obeys_simple_instructions__c,showing__c,pretend_play__c,follows_point__c,loss_of_skills__c,uses_20_50_words__c,two_word_utterances__c,parallel_play__c,interest_in_other_children__c,externalatrisk__c], true)
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
exports.create18mAssessment=create18mAssessment;
exports.create18mAssessment=create24mAssessment;
