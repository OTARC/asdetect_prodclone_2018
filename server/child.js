var db = require('./pghelper'),
    winston = require('winston'),
    util=require('util');


function findById(id) {
    // Retrieve offer either by Salesforce id or Postgress id
    //TODO tighten this up to show only a child of this user (refer getAll)
    return db.query('select id,sfId,Childs_Initials__c,Birthdate__c,gender__c ,Child_currently_at_risk__c ,child__c ,externalchildid__c  from salesforce.mch_child_Asdetect__c WHERE ' + (isNaN(id) ? 'sfId' : 'id') + '=$1', [id], true);
};

function getAll(req, res, next) { 
    var externalUserId = req.externalUserId;
    db.query("select id,sfId,Childs_Initials__c,Birthdate__c,gender__c,Child_currently_at_risk__c ,child__c ,externalchildid__c from salesforce.mch_child_Asdetect__c where asdetect_contact__c__loyaltyid__c=$1 LIMIT $2", [externalUserId,20])       
        .then(function (child) {
            return res.send(JSON.stringify(child));
        })
        .catch(next);
};


function getById(req, res, next) {
    
    console.log('logging req: '+util.inspect(req));
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
    diagnosis__c=req.body.diagnosis__c,
    gender__c=req.body.gender__C;    

    externalchildid = (+new Date()).toString(36); // TODO: more robust UID logic

    console.log(JSON.stringify(req.body));
        
            db.query('INSERT INTO salesforce.mch_child_asdetect__c (asdetect_contact__c__loyaltyid__c, childs_initials__c,birthdate__c,gender__c,diagnosis__c,externalchildid__c) VALUES ($1, $2, $3, $4,$5,$6)', [externalUserId, childs_initials__c,birthdate__C,gender__c,diagnosis__c,externalchildid], true)

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
exports.addChild= addChild;