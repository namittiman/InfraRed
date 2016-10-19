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

exports.delete_reservation = function(req, res) {
    var ReservationId = req.params.ReservationId;
    console.log(ReservationId);

    // CALL AWS
    // WAIT FOR READY STATE
    // STORE IN DB
    // NOTIFY BOT
    

    return res.send("204");
}

exports.get_reservations = function(req, res) {
	console.log(data);
	var userId = req.params.userId;
    var reservationIds = [];
    for(var i = 0; i < data.Reservations.length; i++) {
        var details = data.Reservations[i].ReservationId + ', Instances: ';
        for(var j = 0; j < data.Reservations[i].Instances.length; j++) {
            details += ' ' + data.Reservations[i].Instances[j].PublicDnsName;
        }

        reservationIds.push(details);
    }
    return res.send(reservationIds);
}