require('../models/reservation');
require('../models/key');
var needle = require("needle");
var os   = require("os");
var fs = require('fs');
var mongoose = require('mongoose');
var Reservation = mongoose.model('Reservation');
var Key = mongoose.model('Key');


module.exports = 
{
    create_vm: function (req, res) {
        console.log("\nHandeling Request DO\n");
        //FETCH KEYS AND CALL AWS SDK TO CREATE VMs
        Key.findOne({ "UserId": req.body.UserId, "Service": "do" }, function(err,result) {

            if(err) {
                console.log("Could not fetch keys from database", err);
                return res.send({"status": 500, "message": "Internal Server Error"});
            } else {

                if(result == null) {
                    console.log("Could not fetch keys from database", err);
                    return res.send({"status": 401, "message": "Unauthorized"});
                }  

                var data;

                var name = "DevOps-Node";
                var region = "nyc2";
                var image = "centos-6-5-x64";
                client.createDroplet(name, region, image, function(err, resp, body)
                {
                    if(!err && resp.statusCode == 202)
                    {
                        var dropletId = resp.body.droplet.id;
                        console.log("Got droplet: " + dropletId + " polling for public IP...");

                        // Get IP Handler
                        function getIPCallback(error, response)
                        {
                            data = response.body;
                            if( (data.droplet.networks.v4.length > 0)  && (data.droplet.status == "active") )
                            {
                                console.log(data.droplet.networks.v4[0].ip_address);

                                // All SET!
                                // STORE RESERVATION AND REQUEST IN DB
                                console.log("STORE the following in DB :");
                                console.log();
                                console.log(req.body);
                                var r = { 
                                    "UserId" : req.body.UserId,
                                    "Cloud" : "do",
                                    "Reservation" : data,
                                    "Request" : req.body
                                }

                                Reservation.create(r, function(err, key) {
                                    if(err) {
                                        console.log("Could not write to database", err);
                                        return res.send({"status": 500, "message": "Internal Server Error"});
                                    }
                                    // NOTIFY BOT ABOUT STATUS
                                    return res.send({"status" : 201, "data" : data});
                                });

                            } else {
                                console.log("...");
                                setTimeout(function () {
                                    client.getIP(dropletId, getIPCallback);
                                }, 1000);
                            }
                        }

                        // Get IP
                        client.getIP(dropletId, getIPCallback);
                    }
                });
            }
        });  
        
    },

    terminate_vm: function (req, res) {
        // FETCH KEYS AND CALL AWS SDK
    
        console.log("\nTerminating Request DO\n");
        console.log(req.params.UserId);
        console.log(req.params.ReservationId);

        Key.findOne({ "UserId": req.params.UserId, "Service": "do" }, function(err,result) {

            if(err) {
                console.log("Could not fetch keys from database", err);
                return res.send({"status": 500, "message": "Internal Server Error"});
            } else {

                if(result == null) {
                    console.log("Could not fetch keys from database", err);
                    return res.send({"status": 401, "message": "Unauthorized"});
                }

                var resId = parseInt(req.params.ReservationId);
                Reservation.findOne({"Reservation.droplet.id" : resId}, function(err, resultReservation) {

                    if(err) {
                        console.log("Could not fetch Reservation from database", err);
                        return res.send({"status": 500, "message": "Internal Server Error"});
                    }

                    if(resultReservation == null) {
                        console.log("Could not fetch Reservation Id from database", err);
                        return res.send({"status": 401, "message": "Unauthorized"});
                    }


                    client.deleteDroplet(resId, function(err, resp, body) {
                        if(!err)
                        {
                            console.log("DELETE done");
                        } else {
                            console.log("deleting res failed. status" + resp.statusCode);
                            console.log(err);
                            console.log(resp);
                            console.log(body);
                        }

                    });


                });
                
            }
        }); 

    }


}



// Digital Ocean config and headers
var config = {};
config.token = "610e1ee5b4e5eb3d6db0fbd63806ddc385443d68ff69d81b153b523fa5e3c25e";

var headers =
{
    'Content-Type':'application/json',
    Authorization: 'Bearer ' + config.token
};


// My Digital-Ocean client
var client =
{
    listRegions: function( onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
    },


    listImages: function( onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
    },


    createDroplet: function (dropletName, region, imageName, onResponse)
    {
        var data = 
        {
            "name": dropletName,
            "region":region,
            "size":"512mb",
            "image":imageName,
            // Id to ssh_key already associated with account.
            "ssh_keys":[3407276],
            //"ssh_keys":null,
            "backups":false,
            "ipv6":false,
            "user_data":null,
            "private_networking":null
        };

        console.log("Attempting to create Droplet: "+ JSON.stringify(data) + "\n" );

        needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
    },


    getIP: function(dropletId, onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
    },


    deleteDroplet: function (dropletId, onResponse)
    {
        var data = null;

        console.log("Attempting to delete: "+ dropletId );

        needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, data, {headers:headers,json:true}, onResponse );
    },

};
