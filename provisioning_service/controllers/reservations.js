var data = require("../mock.json");

exports.post_reservations = function(req, res) {
	var userId = req.params.userId;
    console.log(req.body);

    // CALL AWS
    // WAIT FOR READY STATE
    // STORE IN DB
    // NOTIFY BOT
    

    return res.send(data.Reservations[0]);
}
exports.get_reservations = function(req, res) {
	console.log(data);
	var userId = req.params.userId;
    return res.send(data.Reservations);
}