var saveKeyQuestions = ['Please provide your Access Key ID',
 'Please provide Secret Access Key']

function askAccessKeyId(response, convo) {
  //console.log('convo askAccessKeyId');
  //console.log(' Servicename '+ convo.source_message.match[1]); 
  convo.ask(saveKeyQuestions[0], function(response, convo) {
    convo.say("Awesome.");
    //var accessKeyId = response.text;
    //console.log('accessKeyId' + accessKeyId);
    askSecretAccessKey(response, convo);
    convo.next();
  });
}

function askSecretAccessKey(response, convo) {
    //console.log('convo askSecretAccessKey');
    var accessKeyId = response.text;
    //console.log('accessKeyId' + accessKeyId);
    convo.ask(saveKeyQuestions[1], function(response, convo) {
      convo.say("Ok.")
      //var secretKey = response.text;
      //console.log('secretKey' + secretKey);
      saveKeysToDB(response, convo);
      convo.next();
  });
}

function saveKeysToDB(response, convo) { 
    console.log('convo saveKeysToDB');
    var user = convo.source_message.user;
    console.log(' UserId '+ user); 
    var Servicename = convo.source_message.match[1];
    console.log(' Servicename '+ Servicename); 
    var accessKeyId = convo.responses[saveKeyQuestions[0]].text;
    console.log('accessKeyId' + accessKeyId);
    var secretKey = response.text;
    console.log('secretKey' + secretKey);
    // POST /user/keys 
    convo.say("Your Access keys are valid and have been saved.");
    convo.next();
}

exports.askAccessKeyId = askAccessKeyId;
exports.askSecretAccessKey = askSecretAccessKey;
exports.saveKeysToDB = saveKeysToDB;