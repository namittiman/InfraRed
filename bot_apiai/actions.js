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

	  console.log(options);
	  // Send a http request to url and specify a callback that will be called upon its return.
	  request(options, callback);
}


module.exports = 
{
	saveKeys: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** SAVING KEYS ********");
		console.log(response);
		console.log(message);

		var params = {
		      "UserId": message.user,
		      "Service": response.result.parameters.service_name,
		      "AccessKeyId": response.result.parameters.access_key_id,
		      "SecretAccessKey": response.result.parameters.secret_access_key
		};

		var url = provisioning_service_url + '/users/' + params.UserId + '/keys';

		var callback = function (error, response, body) {
			if(body) {
				console.log(body);
				bot.reply(message, "Your keys have been saved successfully!");
			} else {
				console.log(error);
				bot.reply(message, "Your keys could not be saved!");
			}
		};

		console.log(url);
		console.log(params);

		post(params, url, callback);
	},

	createVM: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING VMs ********");
		console.log(response);
		console.log(message);

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
			if(body) {
				console.log(body);
				bot.reply(message, "Your Public DNS name is : " + body.Instances[0].PublicDnsName 
					+ "\n and Public IP : " + body.Instances[0].PublicIpAddress);
			} else {
				console.log(error);
				bot.reply(message, "Sorry, your reservation was not successful!");
			}
		};

		console.log(url);
		console.log(params);

		post(params, url, callback);

	},

	createCluster: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING CLUSTER ********");
		console.log(response);
		console.log(message);

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
			if(body) {
				console.log(body);
				bot.reply(message, "Spark Cluster Created - \n Zeppelin Link : " + "http://" +body.Instances[0].PublicIpAddress + ":8015"
					+ "\n Ambari Server Link : " + "http://" + body.Instances[1].PublicIpAddress + ":8080");
			} else {
				console.log(error);
				bot.reply(message, "Sorry, your cluster reservation was not successful!");
			}
		};

		console.log(url);
		console.log(params);

		post(params, url, callback);

	}
}


