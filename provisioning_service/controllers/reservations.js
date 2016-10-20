var mockData = require("../mock.json");
var sleep = require("sleep");

exports.post_reservations = function(req, res) {
	var userId = req.params.userId;
    console.log(req.body);

    // CALL AWS
    // WAIT FOR READY STATE
    // STORE IN DB
    // NOTIFY BOT
    
    sleep.sleep(5);

    if (req.body.RequestType == "vm")
        return res.send(mockData.Reservations[0]);
    else
        return res.send(mockData.Reservations[1]);
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
	console.log(mockData);
	var userId = req.params.userId;
    var reservationIds = [];
    for(var i = 0; i < mockData.Reservations.length; i++) {

        var details = "" + (i+1) + ". Reservation ID: " + mockData.Reservations[i].ReservationId;

        if (mockData.Reservations[i].type == "vm") {
            for (var j = 0; j < mockData.Reservations[i].Instances.length; j++) {
                details += "\n" + ' '.repeat(5) + mockData.Reservations[i].Instances[j].PublicIpAddress;
            }
        } else {
            details += "\n" + ' '.repeat(5) + "Zeppelin: " + mockData.Reservations[i].cluster_info.zeppelin;
            details += "\n"  + ' '.repeat(5) + "Ambari: " + mockData.Reservations[i].cluster_info.ambari;
        }



        // var details = mockData.Reservations[i].ReservationId + ', Instances: ';
        // for(var j = 0; j < mockData.Reservations[i].Instances.length; j++) {
        //     details += ' ' + mockData.Reservations[i].Instances[j].PublicDnsName;
        // }

        reservationIds.push(details);
    }
    return res.send(reservationIds.join("\n\n"));
}
