'use strict';

var util = require('util');
var path = require('path');
var Bot = require('slackbots');
var Q = require('quixe');
var q = new Q();

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *      token : the API token of the bot (mandatory)
 *      name : the name of the bot (will default to "norrisbot")
 *      dbPath : the path to access the database (will default to "data/norrisbot.db")
 *
 * @param {object} settings
 * @constructor
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */
var NorrisBot = function Constructor(settings) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'zork1bot';

	this.user = null;
	this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(NorrisBot, Bot);

/**
 * Run the bot
 * @public
 */
NorrisBot.prototype.run = function () {
	NorrisBot.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
NorrisBot.prototype._onStart = function () {
	this._loadBotUser();

	var self = this;
	q.init('AlienHelpBot.materials/Release/AlienHelpBot.gblorb',
		function (text) {
			self.postMessageToChannel('chuck', text, { as_user: true });
		});
};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
NorrisBot.prototype._onMessage = function (message) {
	var self = this;
	if (this._isChatMessage(message) &&
		this._isChannelConversation(message) &&
		!this._isFromNorrisBot(message) &&
		this._isMentioningChuckNorris(message)
	   ) {
		q.input(message.text,
			function (text) {
				var channel = self._getChannelById(message.channel);
				self.postMessageToChannel(channel.name, text, { as_user: true });
			});
	}
};

/**
 * Loads the user object representing the bot
 * @private
 */
NorrisBot.prototype._loadBotUser = function () {
	var self = this;
	this.user = this.users.filter(function (user) {
		return user.name === self.name;
	})[0];
};

/**
 * Sends a welcome message in the channel
 * @private
 */
NorrisBot.prototype._welcomeMessage = function () {
	this.postMessageToChannel('chuck', //this.channels[0].name, 
		'Hi guys, roundhouse-kick anyone?' +
		'\n I can tell jokes, but very honest ones. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
		{ as_user: true });
};

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isChatMessage = function (message) {
	return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isChannelConversation = function (message) {
	return typeof message.channel === 'string' &&
		message.channel[0] === 'C'
		;
};

/**
 * Util function to check if a given real time message is mentioning Chuck Norris or the norrisbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isMentioningChuckNorris = function (message) {
	//    return message.text.toLowerCase().indexOf('chuck norris') > -1 ||
	//        message.text.toLowerCase().indexOf(this.name) > -1;
	return true;
};

/**
 * Util function to check if a given real time message has ben sent by the norrisbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isFromNorrisBot = function (message) {
	return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
NorrisBot.prototype._getChannelById = function (channelId) {
	return this.channels.filter(function (item) {
		return item.id === channelId;
	})[0];
};

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 */
var token = process.env.BOT_API_KEY || require('./token');
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var norrisbot = new NorrisBot({
	token: token,
	dbPath: dbPath,
	name: name
});

norrisbot.run();

module.exports = NorrisBot;