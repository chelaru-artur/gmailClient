/**
 * Created by artur on 5/6/15.
 */

module.exports = function(){
    var EventEmitter = require('events').EventEmitter;
    var emitter = new EventEmitter();
    var cfg = require('./config.js');
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(cfg.mongo.uri, function(err, db) {
        console.log("Connected correctly to server");
        emitter.emit('connected',db);

    });

    return emitter;
}