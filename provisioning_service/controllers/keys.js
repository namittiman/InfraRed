//var sleep = require("sleep");
require('../models/key');

var mongoose = require('mongoose'),
Key = mongoose.model('Key');


exports.post_keys = function(req, res) {
  var userId = req.params.UserId;
    console.log(req.body);
    // Write into Database
    // Return success on write else failure

    if(!validate(req.body)) {
        return res.send({"status": 500});
    }
    else{
        /*
        var dict = {};
        dict["_id"] = userId + "_" + req.body.Service;
        dict["document"] =  req.body;
        */
        //req.body["_id"] = userId;
        Key.create(
              req.body, function(err, key) {
                if(err) {
                    return res.send({"status": 400});
                }
                else {
                    return res.send({"status": 200});
                }  
            }    
        );

    }

}

function validate(msg) {
    if(msg.AccessKeyId != null && msg.AccessKeyId.length < 5) {
        return false;
    }
    return true;
}
