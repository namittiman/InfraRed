require('../models/key');
var mongoose = require('mongoose'),
    Key = mongoose.model('Key');

exports.get_keys = function (req, res) {
    var userId = req.params.UserId;
    console.log(req)
    Key.find({"UserId": userId},{Service:1,KeyPair:1
    }, function (err, results) {
        if (err) {
            res.statusCode = 500
            return res.send({"status": 500, "message": "Internal Server Error"});
        } else {
            if (results.length == 0) {
                res.statusCode = 404
                return res.send({"status": 404, "message": "No keys associated with user"});
            } else {
                res.statusCode = 200
                return res.send({"status": 200, "data": results});
            }
        }
    });

};

exports.post_keys = function (req, res) {
    var userId = req.params.UserId;
    console.log("post_keys : POST Request ")
    console.log(req.body);
    // Write into Database
    // Return success on write else failure

    validate(req.body, function (valid) {
        if (!valid) {
            res.statusCode = 400
            return res.send({"status": 400, "message": "Bad Request"});
        } else {
            Key.findOneAndUpdate({"UserId": req.body.UserId, "Service": req.body.Service}, req.body, {
                upsert: true,
                new: true
            }, function (err, key) {
                console.log(key);
                if (err) {
                    res.statusCode = 500
                    return res.send({"status": 500, "message": "Internal Server Error"});
                } else {
                    console.log("Written keys to database");
                    res.statusCode = 201
                    return res.send({"status": 201});
                }
            });
        }
    });
}

function validate(msg, callback) {

    if (msg.Service.toLowerCase() == 'aws') {
        var AWS = require('aws-sdk');
        AWS.config.region = 'us-east-1';
        AWS.config.accessKeyId = msg.AccessKeyId;
        AWS.config.secretAccessKey = msg.SecretAccessKey;
        var acm = new AWS.ACM();
        //callback(true);

        acm.listCertificates({}, function (err, data) {
            //console.log(err);
            if (err == null || (err != null && err.message != "The security token included in the request is invalid.")) {
                callback(true);
            }
            else {
                callback(false);
            }
        });

    } else if (msg.Service.toLowerCase() == 'digital ocean') {
        var needle = require("needle");

        var headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + msg.Token
        };
        console.log(headers);
        needle.get("https://api.digitalocean.com/v2/account", {headers: headers}, function (err, resp, body) {

            if (body.account) {
                console.log("Digital ocean validated....");
                callback(true);
            } else {
                console.log("Digital ocean validation Failed!....");
                callback(false);
            }
        });
    }
}
