var db = require('./pghelper'),
    winston = require('winston'),
    util=require('util');


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


exports.deleteChildrenAndTests=deleteChildrenAndTests;
exports.deleteContactAndChildrenAndTests=deleteContactAndChildrenAndTests;