module.exports = function (db) {
    var express = require('express');
    var router = express.Router();
    var google = require('googleapis');
    var cfg = require('../config.js');
    var OAuth2Client = google.auth.OAuth2;
    var gmail = google.gmail('v1');
    var oauth2Client = new OAuth2Client(cfg.gmail.CLIENT_ID, cfg.gmail.CLIENT_SECRET, cfg.gmail.REDIRECT_URL);

    /* GET home page. */
    router.get('/', function (req, res) {
        var sess = req.session;
        if (sess.id === null || sess.id === undefined) {
            console.log('session obj:', sess);
            res.redirect('/login');
        } else {
            console.log('session obj:', sess);
            res.render('index', {title: 'Express'});

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
        console.log('Code: ', code);
        oauth2Client.getToken(code, function (err, tokens) {
            if (!err) {
                var collection = db.collection("tokens");
                collection.insert(tokens, function (err, data) {
                    console.log(err);
                    console.log(tokens._id);
                    req.session['id'] = tokens.id;
                });
            }
            oauth2Client.setCredentials(tokens);

            res.redirect('/');

        });
    });

    return router;
}
