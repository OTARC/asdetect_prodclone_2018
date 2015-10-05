var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    http = require('http'),
    path = require('path'),
    winston = require('winston'),
    sqlinit = require('./server/sqlinit'),
    util = require('util'),

    // App modules
    //offers = require('./server/offers'),
    //products = require('./server/products'),
    users = require('./server/users'),
    cases = require('./server/cases'),
    //wallet = require('./server/wallet'),
    //wishlist = require('./server/wishlist'),
    //stores = require('./server/stores'),
    //pictures = require('./server/pictures'),
    auth = require('./server/auth'),
    facebook = require('./server/facebook'),
    s3signing = require('./server/s3signing'),
    activities = require('./server/activities'),
    interactions = require('./server/interactions');
    
    //ASDECTECT
    child=require('./server/child');
    assessment=require('./server/assessment');


    app = express();

app.set('port', process.env.PORT || 5000);

app.use(compression());
app.use(bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true
}));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, './client')));

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.send(500, err.message);
});

app.post('/login', auth.login);
app.post('/logout', auth.validateToken, auth.logout);
app.post('/signup', auth.signup);
app.post('/fblogin', facebook.login);

app.get('/users/me', auth.validateToken, users.getProfile);
app.put('/users/me', auth.validateToken, users.updateProfile);

//app.get('/offers', auth.validateToken, offers.getAll);
//app.get('/offers/:id', offers.getById);
//app.get('/products', auth.validateToken, products.getAll);
//app.get('/products/:id', auth.validateToken, products.getById);
//app.get('/stores', stores.getAll);

//app.get('/wallet', auth.validateToken, wallet.getItems);
//app.post('/wallet', auth.validateToken, wallet.addItem);
//app.delete('/wallet/:id', auth.validateToken, wallet.deleteItem);

//app.get('/wishlist', auth.validateToken, wishlist.getItems);
//app.post('/wishlist', auth.validateToken, wishlist.addItem);
//app.delete('/wishlist/:id', auth.validateToken, wishlist.deleteItem);

//app.get('/pictures', auth.validateToken, pictures.getItems);
//app.post('/pictures', auth.validateToken, pictures.addItem);
//app.delete('/pictures', auth.validateToken, pictures.deleteItems);

//app.get('/activities', auth.validateToken, activities.getItems);
//app.post('/activities', auth.validateToken, activities.addItem);
//app.delete('/activities', auth.validateToken, activities.deleteAll);

app.post('/cases', auth.validateToken, cases.createCase);
//app.get('/nfrevoke', cases.revokeToken);

app.post('/s3signing', auth.validateToken, s3signing.sign);

// ASDETECT REST
app.get('/child', auth.validateToken,child.getAll);
app.get('/child/:id', auth.validateToken,child.getById);
app.post('/child', auth.validateToken,child.addChild);
app.get('/assessment', auth.validateToken, assessment.getAll);
app.get('/assessment/:id', auth.validateToken, assessment.getById);
app.post('/assessment/12m',auth.validateToken,assessment.create12mAssessment);
app.post('/assessment/18m',auth.validateToken,assessment.create18mAssessment);
app.post('/assessment/24m',auth.validateToken,assessment.create24mAssessment);
app.post('/assessment/35y',auth.validateToken,assessment.create35yAssessment);
app.get('/interactions', auth.validateToken, interactions.getItems);
app.post('/interactions', auth.validateToken, interactions.addItem);
app.get('/deleteChildrenAndTests',auth.validateToken,child.deleteChildrenAndTests);

app.delete('/interactions', auth.validateToken, interactions.deleteAll);


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});