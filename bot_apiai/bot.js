var Botkit = require('botkit');
var apiai = require('apiai');
var app = apiai(process.env.APIAITOKEN);
var actions = require('./actions.js');

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.ALTCODETOKEN,
}).startRTM()

/** Stores the latest session id associated with the user **/
var sessionMap = {}

controller.hears('(.*)', ['mention', 'direct_mention', 'direct_message'], function (bot, message) {

    if (sessionMap[message.user] == undefined) {
        sessionMap[message.user] = getRandomSessionId(message.user);
    }

    var request = app.textRequest(message.text, {
        sessionId: sessionMap[message.user]
    });

    request.on('response', function (response) {
        console.log(response);
        if (response.result.actionIncomplete) {
            bot.reply(message, response.result.fulfillment.speech);
        } else {
            switch (response.result.action) {
                case 'save.aws.keys':
                    actions.saveAWSKeys(bot, message, response);
                    break;

                case 'save.digitalocean.keys':
                    actions.saveDigitalOceanKeys(bot, message, response);
                    break;

                case 'create.vm':
                    actions.createVM(bot, message, response);
                    break;

                case 'create.cluster':
                    actions.createCluster(bot, message, response);
                    break;

                case 'show.reservations':
                    actions.showReservations(bot, message, response);
                    break;

                case 'set.reminder.reservation':
                    actions.setReminderReservation(bot, message, response);
                    break;

                case 'tear.down':
                    actions.tearDown(bot, message, response);
                    break;

                case 'extend-reservation':
                    actions.extendReservation(bot, message, response);
                    break;

                case 'save.template':
                    actions.saveTemplate(bot, message, response);
                    break;

                case 'use.template':
                    actions.useTemplate(bot, message, response);
                    break;

                case 'show.templates':
                    actions.showTemplates(bot, message, response);
                    break;

                case 'smalltalk.greetings':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'action.exit':
                    bot.reply(message, response.result.fulfillment.speech);
                    sessionMap[message.user] = getRandomSessionId(message.user);
                    break;

                default:
                    bot.reply(message, response.result.fulfillment.speech);

            }
        }
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();
});


function getRandomSessionId(user) {
    return user + Math.random().toString(36).substring(7);
}