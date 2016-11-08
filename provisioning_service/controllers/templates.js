var aws = require('../aws/aws.js');
var docean = require('../do/do.js');
require('../models/reservation');
var mongoose = require('mongoose');
var Reservation = mongoose.model('Reservation');
var Template = mongoose.model('Template');

exports.post_reservations = function(req, res) {
	var userId = req.params.UserId;
    var templateId = req.params.TemplateId;


    console.log("POST reservations request Received : ")
    console.log(req.body);



    
 
}

exports.post_templates = function(req, res) {
    var userId = req.params.UserId;
    var templateId = req.params.TemplateId;
    var reservationId = req.body.ReservationId;

    console.log(req.params);
    console.log("POST templates Received : ")
    console.log(req.body);
    console.log(userId + " " + templateId + " " + reservationId);    

    Reservation.findOne({"Reservation.ReservationId": reservationId}, function(err, result) {
        if(err) {
            return res.send({"status": 500, "message": "Internal Server Error"});
        } else {

            console.log(result);
            if(result == null) {
                console.log("Could not find reservation for this user from database", err);
                return res.send({"status": 400, "message": "The reservation id you provided is not present"});
            }

            var templateObj = {
                "UserId": userId,
                "Name": templateId,
                "Request": result.Request
            }

            Template.findOneAndUpdate({"UserId" : userId, "Name": templateId }, templateObj, { upsert:true , new : true}, function(err, template) {
                console.log(template);
                if(err) {
                    return res.send({"status": 500, "message": "Internal Server Error"});
                } else {
                    console.log("Written template to database");
                    return res.send({"status": 201});
                }
            });

        }
    });



}
