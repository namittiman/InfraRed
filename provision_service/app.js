var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");

var app = express();

/******************************************/
/*****
 * To change the DB add necessary function in db.js
 *****/
var config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
var dbhelper = require("./db");
var db = null;
dbhelper.getMongo(require("mongodb").MongoClient,config.dburl, function (database) {
    db = database;
    app.listen(8888, function () {
        console.log("Server listening ..");
    });
});
/******************************************/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "html", "about.html"))
});

app.post("/", function (req, res) {
    console.log(req.body);
    db.collection(config.table_req).save(req.body, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            // Start a request to aws / digital ocean
            // aws = myawshandler()
            // aws. handleRequest(request,function(){
            // })
            res.send("Please wait while we spin up the cluster");
        }
    });
});



module.exports = app;

