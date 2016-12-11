var Q = require('quixe');
var q = new Q();
q.init('AlienHelpBot.materials/Release/AlienHelpBot.gblorb',
  function (text) {
    console.log('content text', text);
  });
q.input('look');
