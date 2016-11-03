var request = require('request');
var provisioning_service_url = "http://localhost:3001";

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
	  // Send a http request to url and specify a callback that will be called upon its return.
	  request(options, callback);
}

function deleteResource(url, callback) {
	  var options = {
	    url: url,
	    method: 'DELETE',
	    headers: {
	      "User-Agent": "InfraRedBot",
	      "content-type": "application/json",
	    }
	  };
	  console.log("\n DELETE Request \n")
	  console.log(options);
	  // Send a http request to url and specify a callback that will be called upon its return.
	  request(options, callback);
}

function get(url, callback) {
	  // Send a http request to url and specify a callback that will be called upon its return.
	  console.log("\n GET Request \n")
	  console.log(url);
	  request(url, callback);
}


module.exports = 
{
	saveKeys: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** SAVING KEYS ********");
		//console.log(response);
		//console.log(message);

		var params = {
		      "UserId": message.user,
		      "Service": response.result.parameters.service_name,
		      "AccessKeyId": response.result.parameters.access_key_id,
		      "SecretAccessKey": response.result.parameters.secret_access_key
		};

		var url = provisioning_service_url + '/users/' + params.UserId + '/keys';

		var callback = function (error, response, body) {
			if(body.status == 200) {
				console.log(body);
				bot.reply(message, "Your keys have been saved successfully!");
			} else {
				console.log(error);
				bot.reply(message, "Your keys could not be saved!");
			}
		};

		//console.log(url);
		//console.log(params);

		post(params, url, callback);
	},

	createVM: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING VMs ********");
		//console.log(response);
		//console.log(message);

        var params = {
              "UserId": message.user,
              "RequestType": "vm",
              "OS": response.result.parameters.image_type,
              "VCPUs": response.result.parameters.vcpus,
              "VRAM": response.result.parameters.ram,
              "Storage": response.result.parameters.storage,
              "StorageType": "spindle/SSD",
              "Count": 1
        };

		var url = provisioning_service_url + '/users/' + params.UserId + '/reservations';

		var callback = function (error, response, body) {
			if(body.status == 200) {
				console.log("POST Response Body Data \n ")
				console.log(body.data)
				for (var i = 0; i < body.data.Instances.length; i++) {
					bot.reply(message, "Your Public DNS name is : " + body.data.Instances[i].PublicDnsName 
					+ "\n and Public IP : " + body.data.Instances[i].PublicIpAddress);
            	}
			} else {
				console.log(error);
				bot.reply(message, "Sorry, your reservation was not successful!");
			}
		};

		//console.log(url);
		//console.log(params);

		post(params, url, callback);

	},

	createCluster: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING CLUSTER ********");
		//console.log(response);
		//console.log(message);

		var params = {
              "UserId": message.user,
              "RequestType": "cluster",
              "VCPUs": response.result.parameters.vcpus,
              "VRAM": response.result.parameters.ram,
              "Storage": response.result.parameters.storage,
              "StorageType": "spindle/SSD",
              "NodeCount": response.result.parameters.no_of_nodes
        };

		var url = provisioning_service_url + '/users/' + params.UserId + '/reservations';

		var callback = function (error, response, body) {
			if(body.status == 201) {
				console.log(body);
				bot.reply(message, "Spark Cluster Created - \n Zeppelin Link : " + body.data.cluster_info.zeppelin
					+ "\n Ambari Server Link : " + body.data.cluster_info.ambari);
			} else {
				console.log(error);
				bot.reply(message, "Sorry, your cluster reservation was not successful!");
			}
		};

		//console.log(url);
		//console.log(params);

		post(params, url, callback);

	},

	// GET /users/:<userId>/reservations/
	showReservations: function (bot, message, response) {
		console.log("***** SHOWING RESERVATIONS ********");
		var url = provisioning_service_url + '/users/' + message.user + '/reservations';

		var callback = function (error, response, body) {
			if(body) {
				console.log(typeof(body));
				console.log(body);
				bot.reply(message, body);
			} else {
				console.log(error);
				bot.reply(message, "Sorry, I was not able to fetch your reservations at this time.");
			}
		};

		//console.log(url);
		get(url, callback);

	},

	tearDown: function (bot, message, response) {
		
		console.log("***** TEAR DOWN ********");
		console.log(response);
		console.log("***" + response.result.parameters.reservation_id);

		if(response.result.parameters.reservation_id != "") {
			//go ahead and delete that reservation
			var url = provisioning_service_url + '/users/' + message.user + '/reservations/' + response.result.parameters.reservation_id;
			var callback = function (error, response, body) {
				if(body) {
					console.log(body);
					bot.reply(message, "Successfully terminated your reservation.");
				} else {
					console.log(error);
					bot.reply(message, "Sorry, I was not able to terminate your reservation.");
				}
			};

			deleteResource(url, callback);

		} else {
			bot.reply(message, "Please provide a reservation id. (say: `tear down reservation <reservation_id>`)");
			this.showReservations(bot, message, response);

		}

	},

	setReminderReservation: function (bot, message, response) {

		var res = response.result.parameters.any;
		var seconds = response.result.parameters.duration.amount;
		var multiplier = response.result.parameters.duration.unit;

		if (multiplier.includes("min"))
			seconds *= 60;

		if (multiplier.includes("h"))
			seconds *= 60*60;

		if (multiplier.includes("day"))
			seconds *= 60*60*24;

		console.log(seconds);

		var showResFnPtr = this.showReservations;

		setTimeout(function() {
		    console.log('REMINDER!!!');

		    if (res == ""){
		    	bot.reply(message, "Reminder _(" + seconds + multiplier + ")_ : The days of one of your Resevation are numbered! \n" + "`tear down reservation <reservation_id>`");
		    	showResFnPtr(bot, message, response);
		    }
		    else{
		    	bot.reply(message, "Reminder: Time to terminate your reservation! \n" + "`tear down reservation " + res + "`");
		    }
		}, seconds*1000);
	},

	extendReservation: function (bot, message, response) {
	
	}



}


