var setupVMQuestions = ['Which OS do you prefer(say: Ubuntu 14.04)?',
 'How much computing(no. of vCPUs) would you need?',
 'What are your storage requirements?',
 'And, How many such VMs would you require?',
 'Are you sure you want me to spin VMs with foll configuration:'
 ]


function askOSType(response, convo) {
  convo.ask(setupVMQuestions[0], function(response, convo) {
    var osType = response.text;
    console.log('osType' + osType);
    askvCPUs(response, convo);
    convo.next();
  });
}

function askvCPUs(response, convo) {
    convo.ask(setupVMQuestions[1], function(response, convo) {
      convo.say("Ok.")
      var vCPUs = response.text;
      console.log('vCPUs' + vCPUs);
      askStorage(response, convo);
      convo.next();
  });
}

function askStorage(response, convo) {
    convo.ask(setupVMQuestions[2], function(response, convo) {
      convo.say("Cool.")
      var storage = response.text;
      console.log('storage' + storage);
      askVMCount(response, convo);
      convo.next();
  });
}

function askVMCount(response, convo) {
    convo.ask(setupVMQuestions[3], function(response, convo) {
      convo.say("Great.")
      var vmCount = response.text;
      console.log('vmCount' + vmCount);
      confirmVMRequest(response,convo);
      //saveVMRequestToDB(response, convo);
      convo.next();
  });
}

function confirmVMRequest(response, convo) {

    var confirmationQuestion = setupVMQuestions[4]+ 'OS :' + convo.responses[setupVMQuestions[0]].text
    + 'vCPUs :' + convo.responses[setupVMQuestions[1]].text + 'Storage :' + convo.responses[setupVMQuestions[2]].text 
    + 'VMs :' + convo.responses[setupVMQuestions[3]].text;

    console.log(confirmationQuestion);

    convo.ask(confirmationQuestion, function(response, convo) {
      if (response.text == 'yes' || response.text == 'yeah' ){
          convo.say('InfraRed is on it :), estimated time 2 mins.');
          saveVMRequestToDB(response,convo);
          convo.next();

      } else {
           convo.say('*Phew!*');
           convo.next();
      }

    });

}

function saveVMRequestToDB(response, convo) { 

    convo.say('Your instances are up and running. Here are their IPs: ');
    console.log('convo saveVMRequestToDB');
    var user = convo.source_message.user;
    console.log(' UserId '+ user);
    console.log(convo.responses[setupVMQuestions[0]].text);
    console.log(convo.responses[setupVMQuestions[1]].text);
    console.log(convo.responses[setupVMQuestions[2]].text);
    console.log(convo.responses[setupVMQuestions[3]].text);

    // POST /request/vms/
    convo.next();
}

exports.askOSType = askOSType;
exports.askvCPUs = askvCPUs;
exports.askStorage = askStorage;
exports.askVMCount = askVMCount;
exports.confirmVMRequest = confirmVMRequest;
exports.saveVMRequestToDB = saveVMRequestToDB;