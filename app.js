var SlackBot = require('slackbots');
 
 const BOT_NAME = 'alienhelpbot'
// create a bot 
var bot = new SlackBot({
    token: process.env.SLACK_TOKEN,  // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: BOT_NAME
});

function endless() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage 

    var params = {
        icon_emoji: ':cat:'
    };

    bot.postMessageToChannel('general', 'meow!', params, function(data) {
      console.log('DATA', data);
      if (data.message.username !== BOT_NAME) {
          endless();
      }
    });

}

bot.on('start', function() {

 var Q = require('quixe');

 Q('AlienHelpBot.materials/Release/AlienHelpBot.gblorb');



});


bot.on('message', (message) => {

//                if (this.isChatMessage(message) &&
//                    this.isChannelConversation(message) &&
//                    !this.isFromMe(message) &&
//                    this.isGameCommand(message)) {

console.log('M', message);
//                    };

})

/*
    isGameCommand(message) {
        return message.text[0] === '$';
    }
    getGameCommandText(message) {
        return message.text.slice(1);
    }

    isChatMessage(message) {
        return message.type === 'message' && Boolean(message.text);
    }

    isChannelConversation(message) {
console.log('message', message);
        return typeof message.channel === 'string' &&
            message.channel[0] === 'C';
    }

    isFromMe(message) {
        return message.bot_id === this.user.profile.bot_id;
    }
*/    
