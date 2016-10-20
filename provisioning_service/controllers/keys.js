var sleep = require("sleep");


exports.post_keys = function(req, res) {
  var userId = req.params.userId;
    console.log(req.body);
    // Write into Database
    // Return success on write else failure

    sleep.sleep(5);
    return res.send({"status": 200});
}
