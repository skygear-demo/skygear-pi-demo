const exec = require('child_process').exec;
const skygear = require('skygear');

const endPoint = process.env.SKYGEAR_ENDPOINT? process.env.SKYGEAR_ENDPOINT : "https://iotsample.skygeario.com/";
const apiKey = process.env.SKYGEAR_APIKEY? process.env.SKYGEAR_APIKEY : "fe8bc005f8cb4f8b92b187dee6e96f6f";


const HealthModel = skygear.Record.extend('piHealth');

function subscribeReportSaved () {
  skygear.pubsub.on('report-saved', (data) => {
    console.log(data);
    var reportId = data._id;
    var content = data.content;
    var message =  ''+ content + ' (' + reportId + ')';
    console.log(message);
  });
}

function init () {
    console.log(skygear.auth.currentUser);
    skygear.pubsub.publish('ping',{msg:'from pi, alive.'});
    subscribeReportSaved()

    skygear.pubsub.on('ping', (data) => {
      console.log(data);
      skygear.pubsub.publish('reply',{device: skygear.auth.currentUser.id,
        platform: 'pi',
        lastReply: Date()
      });
    });
}

function reg() {
  if (!skygear.auth.currentUser) {
    skygear.auth.signupAnonymously().then((user) => {
      init();
    }).catch(err => {
      console.log(err);
    });
  } else {
    init();
  }
}

skygear.config({
  apiKey: apiKey,
  endPoint: endPoint
}).then(() => {
  console.log("Ready.");
  reg();
}).catch(err => {
  console.log(err);
});

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    // process.stdin.pause();
    process.exit(1);
  }

  if (key && key.name=='p') {
    skygear.pubsub.publish('ping',{msg:'from pi'});
  }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
