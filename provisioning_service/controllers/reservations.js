require('../models/reservation');

var mockData = require("../mock.json");
var mongoose = require('mongoose'),
Reservation = mongoose.model('Reservation');


function validate(msg) {
    if(Number(msg.VCPUs) < 0 || Number(msg.VRAM) < 0 || Number(msg.Storage) < 0 || Number(msg.NodeCount) < 0 || Number(msg.Count) < 0) {
        return false;
    }
    return true;
}

exports.post_reservations = function(req, res) {
	var userId = req.params.UserId;
    console.log(req.body);
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
        var dict = {};
        dict["UserId"] = userId;
        if (req.body.RequestType == "vm") {
            // CALL AWS
            // WAIT FOR READY STATE
            dict["Reservation"] = mockData.Reservations[1];
            Reservation.create(
                dict, function(err, key) {
                    if(err) {
                        return res.send({"status": 400});
                    }
                    else {
                        return res.send({"status": 200});
                    }  
                }    
            );
        } else {
            // CALL AWS
            // WAIT FOR READY STATE
            dict["Reservation"] = mockData.Reservations[1];
            Reservation.create(
                dict, function(err, key) {
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
