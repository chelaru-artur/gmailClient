module.exports = function (db) {
    var express = require('express');
    var ObjectID = require('mongodb').ObjectID;
    var router = express.Router();
    var google = require('googleapis');
    var cfg = require('../config.js');
    var OAuth2Client = google.auth.OAuth2;
    var gmail = google.gmail('v1');
    var oauth2Client = new OAuth2Client(cfg.gmail.CLIENT_ID, cfg.gmail.CLIENT_SECRET, cfg.gmail.REDIRECT_URL);
    var sess;
    /* GET home page. */
    router.get('/', function (req, res) {
        sess = req.session;
        if (sess.recordId) {
            getTokensFromDb(sess.recordId,function(tokens){
                console.log('auth: ', oauth2Client);
                oauth2Client.setCredentials(tokens);
                //gmail.users.messages.list({
                //    userId: 'me',
                //    auth: oauth2Client,
                //    q: 'label:UNREAD'
                //},function(err,res){
                //    console.log(err);
                //    console.log(res);
                //});
                gmail.users.getProfile({userId:'me',auth : oauth2Client},function(err,data){
                    res.render('index', {name: data
                        .emailAddress});
                });
            });

        } else {
            res.redirect('/login');
        }

    });


    router.get('/login', function (req, res) {
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // will return a refresh token
            scope: ['https://mail.google.com/'] // can be a space-delimited string or an array of scopes
        });
        res.send('<a href="' + url + ' "> Get access </a>');
    });

    router.get('/getAccess', function (req, res) {
        var code = req.query.code;
        oauth2Client.getToken(code, function (err, tokens) {
            if (!err) {
                var collection = db.collection("tokens");
                collection.insert(tokens, function (err, data) {
                    req.session.recordId = tokens._id;
                    //req.session.save();
                    res.redirect('/');
                });

            }
            oauth2Client.setCredentials(tokens);
        });
    });


// gets data by record id sored in cockie session
    var getTokensFromDb = function(id,cb){
        var collection = db.collection("tokens");
        collection.find({"_id" : ObjectID.createFromHexString(id)}).toArray(function(err,docs){
            if(docs !== null && docs.length >= 1){
                //return first element of array (from an array with one element )
                cb(docs[0]);
            }else{
                cb(null);
            }

        });
    };

    return router;
}
