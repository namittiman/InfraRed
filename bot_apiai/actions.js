module.exports = 
{
	saveKeys: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** SAVING KEYS ********");
		console.log(response);
		console.log(message);
	},

	createVM: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING VMs ********");
		console.log(response);
		console.log(message);	
	},

	createCluster: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING CLUSTER ********");
		console.log(response);
		console.log(message);
	}
}


