var request = require('request');
var provisioning_service_url = "http://localhost:3001";
var aws = require('../aws/aws.js');
var docean = require('../do/do.js');
require('../models/reservation');
var mongoose = require('mongoose');
var Reservation = mongoose.model('Reservation');
var Template = mongoose.model('Template');



function post(params, url, callback) {
    var options = {
        url: url,
        method: 'POST',
        headers: {
            "User-Agent": "InfraRedBot",
            "content-type": "application/json",
        },
        json: params
    };

    console.log("\n POST Request \n")
    console.log(options);
    request(options, callback);
}



exports.post_reservations = function(req, res) {
	var userId = req.params.UserId;
    var templateId = req.params.TemplateId;
    console.log("POST reservations request Received : ");
    console.log(userId + " " + templateId);

    //read the request based on this template

    Template.findOne({"UserId": userId, "Name": templateId}, function(err, result) {
        if(err) {
            return res.send({"status": 500, "message": "Internal Server Error"});
        } else {
            
            if(result == null) {
                console.log("Could not find the specified template for this user from database", err);
                return res.send({"status": 400, "message": "The template id you provided is not present in the database"});
            }

            console.log(result.Request);


            var params = result.Request;

            var url = provisioning_service_url + '/users/' + params.UserId + '/reservations';

            var callback;
            
            if(result.Request.RequestType === "vm") {
                callback = function (error, response, body) {
                    if(error == null && body.status == 201) {
                        var details = "Your Reservation Id is : " + body.data.ReservationId + "\n>" + " Instance details:";
                        for (var i = 0; i < body.data.Instances.length; i++) {
                            details = details +  "\n>" + " Your Public DNS name is : " + body.data.Instances[i].PublicDnsName 
                            + "\n>" + "and Public IP : " + body.data.Instances[i].PublicIpAddress;
                                        }
                        res.send({"status": 201, "message": details});
                    } else {
                        console.log(error);
                        res.send({"status": 500, "message": "Internal Server Error"});
                    }
                };
            } else {
                callback = function (error, response, body) {
                    if(error == null && body.status == 201) {
                        console.log(body.data);
                        var details = "Spark Cluster Created - \n Zeppelin Link : " + body.data.Reservation.MasterPublicDnsName + ":8890";
                        res.send({"status": 201, "message": details});
                    } else {
                        console.log(error);
                        res.send({"status": 500, "message": "Internal Server Error"});
                    }
                };
            }


            

            post(params, url, callback);





        }
    });


    
 
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
