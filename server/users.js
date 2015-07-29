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
                    'SELECT id, firstName__c as firstName, lastName__c as lastName, email__c as email,createddate,preference__c as preference,size__c as size FROM salesforce.asdetect_contact__c WHERE id=$1',
                    [userId], true)
                .then(function (user) {
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
            [user.firstname, user.lastname, user.preference,user.size, userId])
        .then(function () {
            res.send(user);
        })
        .catch(next);
};

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;