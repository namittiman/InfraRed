var mockData = require("../mock.json");
var sleep = require("sleep");
var aws = require('../aws/aws.js');



function validate(msg) {
    if(Number(msg.VCPUs) < 0 || Number(msg.VRAM) < 0 || Number(msg.Storage) < 0 || Number(msg.NodeCount) < 0 || Number(msg.Count) < 0) {
        return false;
    }
    return true;
}

exports.post_reservations = function(req, res) {
	var userId = req.params.userId;
    console.log("POST request Received : ")
    console.log(req.body);
    aws.handle_request(req, res);
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

        var vmConfig = mockData.Reservations[i].request;
        var details = "" + (i+1) + ". Reservation ID: *" + mockData.Reservations[i].ReservationId + "*";
        details += "\n> _(" + vmConfig.OS + ", " + vmConfig.VCPUs + "vCPUs, " + vmConfig.VRAM + "GB RAM, " + 
                    vmConfig.Storage + "GB " + vmConfig.StorageType + ")_ *x" + mockData.Reservations[i].Instances.length + "*";

        if (mockData.Reservations[i].type == "vm") {
            for (var j = 0; j < mockData.Reservations[i].Instances.length; j++) {
                details += "\n>" + mockData.Reservations[i].Instances[j].PublicIpAddress;
            }
        } else {
            details += "\n>" + "Zeppelin: " + mockData.Reservations[i].cluster_info.zeppelin;
            details += "\n>" + "Ambari: " + mockData.Reservations[i].cluster_info.ambari;
        }

        reservationIds.push(details);
    }
    return res.send(reservationIds.join("\n\n"));
}
