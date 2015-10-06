var db = require('./pghelper'),
    winston = require('winston'),
    uuid = require('node-uuid'),
    missingChildInformation ='One or more missing mandatory fields for Child',
    util=require('util');


function findById(id) {
    // Retrieve offer either by Salesforce id or Postgres id
    //TODO tighten this up to show only a child of this user (refer getAll)
    //
    return db.query('select id,sfId,childs_initials__c,child_s_first_name__c, child_s_last_name__c, childs_nickname__c,birthdate__c,total_months_old__c,gender__c ,child_currently_at_risk__c ,child_Ever_at_risk__c,asdetect_contact__c ,externalchildid__c,_hc_lastop,_hc_err from asdetect.mch_child_Asdetect__c WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
};

//get all children for a contact
function getAll(req, res, next) { 
    var externalUserId = req.externalUserId;
    db.query("select id,sfId,childs_initials__c,child_s_first_name__c, child_s_last_name__c, childs_nickname__c,birthdate__c,total_months_old__c,gender__c,child_currently_at_risk__c ,child_ever_at_risk__c, asdetect_contact__c ,externalchildid__c,_hc_lastop,_hc_err from asdetect.mch_child_Asdetect__c where asdetect_contact__r__loyaltyid__c=$1 LIMIT $2", [externalUserId,20])       
        .then(function (child) {
            return res.send(JSON.stringify(child));
        })
        .catch(next);
};


//get all children for a contact
function deleteChildrenAndTests(req, res, next) { 
    var externalUserId = req.externalUserId;
    console.log('!!!!!! DELETING CHILDREN AND TESTS !!!!!!');
    db.query("select delete_children_and_tests($1)", [externalUserId])       
        .then(function (result) {
            return res.send(JSON.stringify(result));
        })
        .catch(next);
};


function deleteContactAndChildrenAndTests(req, res, next) { 
    var externalUserId = req.externalUserId;
    console.log('!!!!!! DELETING CONTACT AND CHILDREN AND TESTS !!!!!');
    db.query("select delete_contact_and_children_and_tests($1)", [externalUserId])       
        .then(function (result) {
            return res.send(JSON.stringify(result));
        })
        .catch(next);
};

function getById(req, res, next) {
    console.log('logging req: '+ util.inspect(req));
    var id = req.params.id;
    findById(id)
        .then(function (child) {
            console.log(JSON.stringify(child));
            return res.send(JSON.stringify(child));
        })
        .catch(next);
};


function addChild(req, res, next) {
    var externalUserId = req.externalUserId,
    birthdate__c = req.body.birthdate__c,
    childs_initials__c=req.body.childs_initials__c,
    child_s_first_name__c=req.body.child_s_first_name__c,
    child_s_last_name__c=req.body.child_s_last_name__c,
    childs_nickname__c=req.body.childs_nickname__c,
    diagnosis__c=req.body.diagnosis__c,
    gender__c=req.body.gender__c;  

    if ((birthdate__c==null) || (birthdate__c=="") || (childs_initials__c==null) || (childs_initials__c=="") || (child_s_first_name__c==null) || (child_s_first_name__c=="") || (gender__c==null) || (gender__c=="")) {
        return res.send(400, missingChildInformation);
    }

    //externalchildid__c = (+new Date()).toString(36); // TODO: more robust UID logic
    externalchildid__c=uuid.v4();

    console.log(JSON.stringify(req.body));
        
            db.query('INSERT INTO asdetect.mch_child_asdetect__c (asdetect_contact__r__loyaltyid__c, childs_initials__c,child_s_first_name__c,child_s_last_name__c,childs_nickname__c,birthdate__c,gender__c,diagnosis__c,externalchildid__c) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [externalUserId, childs_initials__c,child_s_first_name__c,child_s_last_name__c,childs_nickname__c,birthdate__c,gender__c,diagnosis__c,externalchildid__c], true)

                .then(function () {
                    return res.send({'externalchildid__c':externalchildid__c});
                    //return res.send('ok');
                })
                .fail(function(err) {
                    return next(err);
                })
        .catch(next);

};



exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
exports.addChild= addChild;
exports.deleteChildrenAndTests=deleteChildrenAndTests;
exports.deleteContactAndChildrenAndTests=deleteContactAndChildrenAndTests;