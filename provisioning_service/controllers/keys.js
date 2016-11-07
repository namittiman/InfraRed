require('../models/key');
var mongoose = require('mongoose'),
    Key = mongoose.model('Key');

exports.post_keys = function (req, res) {
    var userId = req.params.UserId;
    console.log("post_keys : POST Request ")
    console.log(req.body);
    // Write into Database
    // Return success on write else failure

    validate(req.body, function (valid) {
        if (!valid) {
            return res.send({"status": 400, "message": "Bad Request"});
        } else {
            Key.create(req.body, function (err, key) {
                if (err) {
                    return res.send({"status": 500, "message": "Internal Server Error"});
                } else {
                    return res.send({"status": 201});
                }
            });
        }
    });
}

function validate(msg , callback) {

    if (msg.Service.toLowerCase() == 'aws') {
        var AWS = require('aws-sdk');
        AWS.config.region = 'us-east-1';
        AWS.config.accessKeyId = msg.AccessKeyId;
        AWS.config.secretAccessKey = msg.SecretAccessKey;

        var acm = new AWS.ACM();
        acm.listCertificates({}, function (err, data) {
            if (err){
                callback(false);
            }
            else{
                callback(true);
            }

        });
    }else if(msg.Service.toLowerCase() == 'do'){

    }
}
