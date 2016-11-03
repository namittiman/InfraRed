require('../models/key');
var mongoose = require('mongoose'),
Key = mongoose.model('Key');

exports.post_keys = function(req, res) {
  var userId = req.params.UserId;
    console.log("post_keys : POST Request ")
    console.log(req.body);
    // Write into Database
    // Return success on write else failure

    if(!validate(req.body)) {
        return res.send({"status": 500});
    } else {
        Key.create(req.body, function(err, key) {
            if(err) {
                return res.send({"status": 400});
            } else {
                console.log("Inserted into Db key")
                console.log(key)
                return res.send({"status": 200});
            }  
        });
    }
}

function validate(msg) {
    if(msg.AccessKeyId != null && msg.AccessKeyId.length < 5) {
        return false;
    }
    return true;
}
