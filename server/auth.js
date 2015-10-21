var bcrypt = require('bcrypt'),
    db = require('./pghelper'),
    config = require('./config'),
    uuid = require('node-uuid'),
    Q = require('q'),
    validator = require('validator'),
    winston = require('winston'),
    UAParser = require('ua-parser-js'),
    invalidCredentials = 'Invalid email or password';

/**
 * Encrypt password with per-user salt
 * @param password
 * @param callback
 */
function encryptPassword(password, callback) {
    winston.info('encryptPassword');
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });
    });
}

/***
 * Compare clear with hashed password
 * @param password
 * @param hash
 * @param callback
 */
function comparePassword(password, hash, callback) {
    winston.info('comparePassword');

    bcrypt.compare(password, hash, function (err, match) {
        if (err) {
            return callback(err);
        }
        return callback(null, match);
    });
}

/**
 * Create an access token
 * @param user
 * @returns {promise|*|Q.promise}
 */
function createAccessToken(user) {
    winston.info('createAccessToken');
    var token = uuid.v4(),
    
    deferred = Q.defer();
    
    
    db.query('INSERT INTO tokens (userId, externalUserId, token) VALUES ($1, $2, $3)', [user.id, user.externaluserid, token])
        .then(function() {
            deferred.resolve(token);
        })

        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}


function logUserInteraction(externaluserid,itype,idescription,ios) {
    winston.info('logUserInteraction');

    var token = uuid.v4(),  
    deferred = Q.defer();
    db.query('INSERT INTO asdetect.asdetect_interaction__c (asdetect_contact__r__loyaltyid__c, type__c,description__c,os__c) VALUES ($1, $2, $3, $4)',
                    [externaluserid, itype, idescription,ios], true)
    .then(function() {
            //deferred.resolve(token);
        })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}


function cleanupAccessTokens(user) {
    winston.info('cleanupAccessTokens');

    var tokenlife=config.asdetect.tokenlife;
    
    var deferred = Q.defer();
    
    db.query('delete from tokens where userId=$1 and now()-created > $2', [user.id, tokenlife])
        .then(function() {
            //deferred.resolve(token);
        })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}



/**
 * Regular login with application credentials
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function login(req, res, next) {
    winston.info('login');

    var creds = req.body;
    console.log(creds);

    var parser = new UAParser();
    var ua = req.headers['user-agent'];

    console.log('user agent is: '+ua);

    var os = parser.setUA(ua).getResult().os.name;
   


    // Don't allow empty passwords which may allow people to login using the email address of a Facebook user since
    // these users don't have passwords
    if (!creds.password__c || !validator.isLength(creds.password__c, 1)) {
        return res.send(401, invalidCredentials);
    }

    db.query('SELECT id, firstname__c, lastname__c , email__c, loyaltyid__c as externalUserId, password__c  FROM asdetect.asdetect_contact__c WHERE email__c=$1', [creds.email__c], true)
        .then(function (user) {
            if (!user) {
                return res.send(401, invalidCredentials);
            }
            comparePassword(creds.password__c, user.password__c, function (err, match) {
                if (err) return next(err);
                if (match) {  
                     logUserInteraction(user.externaluserid,'Logged In','Node.js auth',os)    
                     .then             
                     cleanupAccessTokens(user)
                     .then
                      createAccessToken(user)
                        .then(function(token) {
                            return res.send({'user':{'email__c': user.email__c, 'firstname__c': user.firstname__c, 'lastname__c': user.lastname__c}, 'token': token});
                        })
                        .catch(function(err) {
                            return next(err);    
                        });


                } else {
                    // Passwords don't match
                    return res.send(401, invalidCredentials);
                }
            });
        })
        .catch(next);
};


/**
 * Logout user
 * @param req
 * @param res
 * @param next
 */
function logout(req, res, next) {
    winston.info('logout');
    var token = req.headers['authorization'];
    

    winston.info('Logout token:' + token);

    logUserInteraction(req.externalUserId,'Logged Out','Node.js auth','')
    .then
    db.query('DELETE FROM tokens WHERE token = $1', [token])
        .then(function () {
            winston.info('Logout successful');
            res.send('OK');
        })
        .catch(next);
};

/**
 * Signup
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function signup(req, res, next) {

    winston.info('signup');

    var user = req.body;

    console.log(user);

    if (!validator.isEmail(user.email__c)) {
        return res.send(400, "Invalid email address");
    }
    if (!validator.isLength(user.firstname__c, 1) || !validator.isAlphanumeric(user.firstname__c)) {
        return res.send(400, "First name must be at least one character");
    }
    if (!validator.isLength(user.lastname__c, 1) || !validator.isAlphanumeric(user.lastname__c)) {
        return res.send(400, "Last name must be at least one character");
    }
    if (!validator.isLength(user.password__c, 4)) {
        return res.send(400, "Password must be at least 4 characters");
    }

    db.query('SELECT id FROM asdetect.asdetect_contact__C WHERE email__c=$1', [user.email__c], true)
        .then(function (u) {
            if(u) {
                return res.send(400, "Email address is already registered");
            }
            encryptPassword(user.password__c, function (err, hash) {
                if (err) return next(err);
                createUser(user, hash)
                    .then(function () {
                        return res.send('OK');
                    })
                    .catch(next);
            });
        })
        .catch(next);
};

/**
 * REsetpassword
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function requestResetPassword(req, res, next) {

    winston.info('reset password');

    var user = req.body;

    console.log('user received resetpassword request for: '+user.email__c);

    if (!validator.isEmail(user.email__c)) {
        return res.send(400, "Invalid email address");
    }
   
    db.query('SELECT id FROM asdetect.asdetect_contact__C WHERE email__c=$1', [user.email__c], true)
        .then(function (u) {
            if(u) {   
            /* this is a valid user*/
            console.log('found an existing user');
            // do something to initiate an email etc.
            return res.send('OK');
            }
            console.log('User not registered');
            return res.send(400, "This user is not registered");
            
        })
        .catch(next);
};


/**
 * Create a user
 * @param user
 * @param password
 * @returns {promise|*|Q.promise}
 */
function createUser(user, password) {

    winston.info('createUser');
    var deferred = Q.defer(),
        //external userid is the EXTERNALID in the ASDetect_Contact__c table - it's critical for hooking up the MCH_Child_Asdetect__C detail records
        //externalUserId = (+new Date()).toString(36); // TODO: more robust UID logic
        externalUserId=uuid.v4();

    db.query('INSERT INTO asdetect.asdetect_contact__c (email__c, password__c, firstname__c, lastname__c, country__c, loyaltyid__c) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, firstname__c, lastname__c, email__c, loyaltyid__c as externalUserId',
        [user.email__c, password, user.firstname__c, user.lastname__c, 'Australia', externalUserId], true)
        .then(function (insertedUser) {
            deferred.resolve(insertedUser);
        })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
};





/**
 * Update user password
 * @param user
 * @param password
 * @returns {promise|*|Q.promise}
 */
function updateUserPassword(user, password) {

    winston.info('updateUserPassword');
    var deferred = Q.defer(),    
// the loyaltyid__c field identifies the user
    db.query('UPDATE asdetect.asdetect_contact__c SET password__c=$1 WHERE loyaltyid__c=$2',
        [password, user.loyaltyid__c], true)
        .then(function (updatedUser) {
            deferred.resolve(updatedUser);
        })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
};


/**
 * Validate authorization token
 * @param req
 * @param res
 * @param next
 * @returns {*|ServerResponse}
 */
function validateToken (req, res, next) {
    winston.info('validateToken');
    
    var token = req.headers['authorization'];
    if (!token) {
        token = req.session['token']; // Allow token to be passed in session cookie
    }
    if (!token) {
        winston.info('No token provided');
        return res.send(401, 'Invalid token');
    }
    db.query('SELECT * FROM tokens WHERE token = $1', [token], true, true)
        .then(function (item) {
            if (!item) {
                winston.info('Invalid token');
                return res.send(401, 'Invalid token');
            }
            req.userId = item.userid;
            req.externalUserId = item.externaluserid;
            return next();
        })
        .catch(next);
};

exports.login = login;
exports.logout = logout;
exports.signup = signup;
exports.requestResetPassword=requestResetPassword;
exports.createUser = createUser;
exports.createAccessToken = createAccessToken;
exports.validateToken = validateToken;