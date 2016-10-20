var sleep = require("sleep");


exports.post_keys = function(req, res) {
  var userId = req.params.userId;
    console.log(req.body);
    // Write into Database
    // Return success on write else failure

    sleep.sleep(5);
    if(!validate(req.body)) {
    	return res.send({"status": 500});
    }

    return res.send({"status": 200});
}

function validate(msg) {
    if(msg.AccessKeyId != null && msg.AccessKeyId.length < 5) {
        return false;
    }
    return true;
}
