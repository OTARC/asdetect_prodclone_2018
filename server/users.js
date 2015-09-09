var db = require('./pghelper'),
    activities = require('./activities'),
    winston = require('winston');

/**
 * Get user profile
 * @param req
 * @param res
 * @param next
 */
function getProfile(req, res, next) {
    var userId = req.userId,
        externalUserId = req.externalUserId;

    activities.getPointBalance(externalUserId)
        .then(function (activity) {
            db.query(
                    'SELECT id, firstname__c , lastname__c , email__c,createddate,preference__c ,size__c,_hc_lastop,_hc_err FROM salesforce.asdetect_contact__c WHERE id=$1',
                    [userId], true)
                .then(function (user) {
                    //dtermine what to do with Points later - perhaps we could introduce a membership concept??
                    user.points = activity.points;
                    user.status = activities.getStatus(activity.points);
                    console.log(user);
                    res.send(JSON.stringify(user));
                })
                .catch(next);
        })
        .catch(next);
}

/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 */
function updateProfile(req, res, next) {

    var user = req.body,
        userId = req.userId;

    console.log('updating: ' + JSON.stringify(user));

    db.query('update salesforce.asdetect_contact__c SET firstName__c=$1, lastName__c=$2, Preference__c=$3,size__c=$4  WHERE id=$5',
            [user.firstname__c, user.lastname__c, user.preference__c,user.size__c, userId])
        .then(function () {
            res.send(user);
        })
        .catch(next);
};

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;