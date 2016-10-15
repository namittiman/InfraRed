/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# USE THE BOT:
  Find your bot inside Slack to send it a direct message.
  Say: "who are you"/ "identify yourself" /"what is your name"
  infraredBOT: "I am a bot named @infrared. I am a DevOps Bot that helps manage your infrastrastructure."
  
  Config Keys Convo-  
  Say: "save key aws/digitalocean" or  "configure aws/digitalocean"
  infraredBOT: "Please provide your Access Key ID"

  Say:"AKIAJXRH234323C4TSLIIQ"
  infraredBOT: "Awesome. Please provide Secret Access Key"
     
  Say:"Hxj9KWDMwro/wq4234zL2pI3boIMe3245Dr9FTOvpH"
  infraredBOT:  "Ok.""

  infraredBOT: "Your Access keys are valid and have been saved.""

  SetupVM Convo- 
  say:"setupvm"
  infraredBOT:"Which OS do you prefer(say: Ubuntu 14.04)?""
   
  say: "ubuntu 14.4"
  infraredBOT:"How much computing(no. of vCPUs) would you need?""

  say: "4"
  infraredBOT: "Ok. What are your storage requirements?"
  
  say:"50 Gb"
  infraredBOT: "Cool.And, How many such VMs would you require?""

  say: "2"
  infraredBOT: "Great.Are you sure you want me to spin VMs with foll configuration:OS :fedora 1.5vCPUs :3Storage :50 GbVMs :2"
  
  say: "yes"/"yeah"
  infraredBOT:"InfraRed is on it :), estimated time 2 mins."
     
  infraredBOT:"Your instances are up and running. Here are their IPs:"
  

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Botkit = require('botkit');
var saveKeysConvo = require("./save_keys_convo.js");
var setupVMConvo = require("./setup_vm_convo.js");
var requirementParser = require("./parser.js");


var controller = Botkit.slackbot({
    debug: false,
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
var bot = controller.spawn({
    //token: process.env.ALTCODETOKEN,
    token: 'xoxb-89165895107-xbDUPqXwnOlrZ7yXh9IcTANq',  
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

// Example receive middleware.
// for example, recognize several common variations on "hello" and add an intent field to the message
// see below for example hear_intent function
controller.middleware.receive.use(function(bot, message, next) {

    console.log('Receive middleware!');
    // make changes to bot or message here before calling next
    if (message.text == 'hello' || message.text == 'hi' || message.text == 'howdy' || message.text == 'hey') {
        message.intent = 'hello';
    }

    //console.log(message);
    next();

});

// Example send middleware
// make changes to bot or message here before calling next
// for example, do formatting or add additional information to the message
controller.middleware.send.use(function(bot, message, next) {

    console.log('Send middleware!');
    next();

});


// Example hear middleware
// Return true if one of [patterns] matches message
// In this example, listen for an intent field, and match using that instead of the text field
function hear_intent(patterns, message) {

    for (var p = 0; p < patterns.length; p++) {
        if (message.intent == patterns[p]) {
            return true;
        }
    }

    return false;
}


/* note this uses example middlewares defined above */
controller.hears(['hello'],'direct_message,direct_mention,mention',hear_intent, function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });

});

controller.hears(['configure (.*)','save key (.*)'],['direct_message,direct_mention,mention'],function(bot,message) {
    var Servicename = message.match[1];
    //console.log('Servicename '  + Servicename);
    bot.startConversation(message, saveKeysConvo.askAccessKeyId);
});

controller.hears(['setupvm'],['direct_message,direct_mention,mention'],function(bot,message) {
    bot.startConversation(message, setupVMConvo.askOSType);
});

// Quick Commands
controller.hears(['.* spin (.*)','.* provision (.*)'],['direct_message,direct_mention,mention'],function(bot,message) {
    var input = message.text;
    var resJson = requirementParser.jsonThisString(input);

    bot.reply(message, "Bro, " + JSON.stringify(resJson) + " this cool?");
});

controller.hears(['identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I am a DevOps Bot that helps manage your infrastrastructure.');

});