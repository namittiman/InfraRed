var AWS = require('aws-sdk');
var uuid = require('node-uuid');
AWS.config.region = 'us-east-1';
var ec2 = new AWS.EC2();

module.exports = 
{
    handle_request: function (req, res) {
        console.log("\nHandeling Request AWS\n")

        // TODO - As per the request make the change to the request
        // Image type? , Storage etc.
        // Currently the simplest case, testing end to end flow

        var params = {
            ImageId: 'ami-40d28157', // Ubuntu Server 16.04 LTS (HVM), SSD Volume Type - ami-40d28157
            InstanceType: 't2.micro',
            MinCount: 1, MaxCount: req.body.Count
        };


        // Create the instance
        ec2.runInstances(params, function(err, data) {
            if (err) {
                console.log("Could not create instance", err);
                return res.send({"status": 500});;
            }

            console.log(data);
            // Saving the instance IDs and Reservation ID so that 
            // we can wait for instanceRunning on those
            var reservationId = data.ReservationId
            var instanceIds = []
            for (var i = 0; i < data.Instances.length; i++) {
                var instanceId = data.Instances[i].InstanceId;
                instanceIds.push(instanceId)
            }; 
            console.log("Created instance Ids", instanceIds);

            var params = {
                InstanceIds: instanceIds
            };
            ec2.waitFor('instanceRunning', params, function(err, data) {
                if (err) {
                    console.log("Could not create instance", err);
                    return res.send({"status": 500});;
                } else {
                    console.log(data);           // successful response
                    var reservation_json_to_store;
                    for (var i = 0; i < data.Reservations.length; i++) {
                        if (data.Reservations[i].ReservationId === reservationId) {
                            reservation_json_to_store = data.Reservations[i];
                            break;
                        }
                    }
                    // TODO, STORE IN DB
                    console.log("STORE the following in DB :")
                    console.log(reservation_json_to_store);

                    /* r = { 
                        UserId : req.UserId,
                        Reservation : reservation_json_to_store
                        }

                        db.reservations.save(r);

                    */

                    var reservation_json_to_send_to_client;
                    // TODO, Currently returning whatever we got from AWS to client
                    reservation_json_to_send_to_client = reservation_json_to_store;
                    return res.send(reservation_json_to_send_to_client);
                }
            });
        });
    }
}
