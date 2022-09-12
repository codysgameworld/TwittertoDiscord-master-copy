/**
 *
 * Style guide: Airbnb JavaScript Style Guide;
 * see: https://github.com/airbnb/javascript.
 */

const Discord = require('discord.js');
const cheerio = require('cheerio');
const E = require('events');
const async = require('async');
const request = require('request');

const client = new Discord.Client();
const separateReqPool = { maxSockets: 15 };
const tweets = {};
let apiurls = [];
const N = [];
let isActive = false; // Wether the monitor is active.

// TWITTER HANDLERS
const THandlers = [
  {
    name: 'Account 1', // name doesn't matter.
    url: 'https://twitter.com/codysgameworld',
    webhook: 'https://discordapp.com/api/webhooks/671747151658876961/R2RGOGeaBbvtprY_cBkgYKz3V4ffWLV0z_6aGHntH0-hXbwkuGrEEkyiZsfVbyy6qLkM', // TODO: Set a proper webhook URL.
    avatar_url: ' ',
    keywords: '*', // looks for all new tweets.
  },
  {
    name: 'Account 2',
    url: 'https://twitter.com/cybersole',
    webhook: 'https://discordapp.com/api/webhooks/671747151658876961/R2RGOGeaBbvtprY_cBkgYKz3V4ffWLV0z_6aGHntH0-hXbwkuGrEEkyiZsfVbyy6qLkM', // TODO: Set a proper webhook URL.
    avatar_url: ' ',
    keywords: '*', // looks for all new tweets.
  },

{
  name: 'Account 3',
  url: 'https://twitter.com/balkobot',
  webhook: 'https://discordapp.com/api/webhooks/671747151658876961/R2RGOGeaBbvtprY_cBkgYKz3V4ffWLV0z_6aGHntH0-hXbwkuGrEEkyiZsfVbyy6qLkM', // TODO: Set a proper webhook URL.
  avatar_url: ' ',
  keywords: '*', // looks for all new tweets.
},

{
  name: 'Account 4',
  url: 'https://twitter.com/prismAIO',
  webhook: 'https://discordapp.com/api/webhooks/671747151658876961/R2RGOGeaBbvtprY_cBkgYKz3V4ffWLV0z_6aGHntH0-hXbwkuGrEEkyiZsfVbyy6qLkM', // TODO: Set a proper webhook URL.
  avatar_url: ' ',
  keywords: '*', // looks for all new tweets.
},

];

// ADD TWEETS
const updateApiURLs = function updateapiurls() {
  apiurls = [];
  THandlers.forEach((th, i) => {
    tweets[th.url] = [];
    apiurls.push(th.url);
  });
}

updateApiURLs();

// DISCORD WEBHOOK
const sendDiscordMessage = function sendDiscordMessageThroughWebhook(pl) {
  const { content, turl } = pl;
  const { name, webhook, avatar_url } = THandlers.filter((d, i) => d.url === turl)[0];
  request.post(webhook).form({ username: name, content });
};

// MONITOR
const createMonitor = function createMonitor() {
  isActive = true;
  console.log('Twitter to Discord program is running.');
  const monitorID = setInterval(() => {
    async.map(apiurls, function(item, callback) {
      request({ url: item, pool: separateReqPool }, function (error, response, body) {
        try {
          const $ = cheerio.load(body);
          const turl = "https://twitter.com" + response.req.path;
          if (tweets[turl].length === 0) {
            // First load.
            for (let i=0; i < $('div.js-tweet-text-container p').length; i++) {
              tweets[turl].push($('div.js-tweet-text-container p').eq(i).text());
            }
          } else {
            // Every other time.
            for (let i=0; i < $('div.js-tweet-text-container p').length; i++) {
              const s_tweet = $('div.js-tweet-text-container p').eq(i).text();

              // Check if tweet is new.
              if (tweets[turl].indexOf(s_tweet) === -1) {
                tweets[turl].push(s_tweet);
                const th_kw = THandlers.filter((d,i) => d.url === turl)[0].keywords.split(',');
                const th_name = THandlers.filter((d,i) => d.url === turl)[0].name;
                let nFlag = false;
                th_kw.forEach((kw,j) => {
                  if (kw === '*' || s_tweet.indexOf(kw) != -1) {
                    nFlag = true;
                  }
                });

                if (nFlag) {
                  sendDiscordMessage({ content: s_tweet, turl });
                }
              }
            }
          }
        } catch (error) {
          console.error('[Error]', error);
        }
      });
    }, function(err, results){
        //console.log(results);
    });
  }, 500); // Runs every 0.5 second.

  const monitorDuration = 43200000; // The monitors stops after 1 day.
  setTimeout(() => {
    clearInterval(monitorID);
    isActive = false;
    console.log('Twitter to Discord program has ended.');
  }, monitorDuration);
}

createMonitor();

// DISCORD BOT
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}.`);

  // ...
  console.log('Ready!');
});

client.on('message', (message) => {
  if (!message.content.startsWith('!account1')) return;
  THandlers[0].url = "https://twitter.com/" + message.content.slice(10); // Removes the first 9 characters of the message content.
  updateApiURLs();
  if (!isActive) {
    createMonitor();
  }
  return message.channel.send(`@${message.content.slice(10)}`);
});

client.on('message', (message) => {
  if (!message.content.startsWith('!account2')) return;
  THandlers[1].url = "https://twitter.com/" + message.content.slice(10); // Removes the first 9 characters of the message content.
  updateApiURLs();
  if (!isActive) {
    createMonitor();
  }
  return message.channel.send(`@${message.content.slice(10)}`);
});

client.on('message', (message) => {
  if (!message.content.startsWith('!account3')) return;
  THandlers[2].url = "https://twitter.com/" + message.content.slice(10); // Removes the first 9 characters of the message content.
  updateApiURLs();
  if (!isActive) {
    createMonitor();
  }
  return message.channel.send(`@${message.content.slice(10)}`);
});

client.on('message', (message) => {
  if (!message.content.startsWith('!account4')) return;
  THandlers[3].url = "https://twitter.com/" + message.content.slice(10); // Removes the first 9 characters of the message content.
  updateApiURLs();
  if (!isActive) {
    createMonitor();
  }
  return message.channel.send(`@${message.content.slice(10)}`);
});

//ping
client.on('message', msg => {
//looks for links
    if (msg.content.includes ('http://')) {

      if (msg.content.includes("@everyone")){
        msg.channel.send("Good luck!")
      }
      else{ msg.channel.send('@everyone ' + msg);}
  }


});

client.on('message', msg => {
//looks for links
    if (msg.content.includes ('https://')) {

      if (msg.content.includes("@everyone")){
        msg.channel.send("Good luck!")
      }
      else{ msg.channel.send('@everyone ' + msg);}
  }


});

client.on('message', msg => {
//looks for links
    if (msg.content.includes ('discord.gg')) {

      if (msg.content.includes("@everyone")){
        msg.channel.send("Good luck!")
      }
      else{ msg.channel.send('@everyone ' + msg);}
  }});

  client.on('message', msg => {
  //looks for links
for (var i = 0; i < kw.length; i++) {

      if (msg.content.includes (kw[i])) {

        if (msg.content.includes("@everyone")){
          msg.channel.send("Good luck!")
        }
        else{ msg.channel.send('@everyone ' + msg);}
    }}});


var kw = ["Password", "Restock"]

client.login('NjY5NjA0ODYzOTE4ODY2NDUx.Xi9piA.fq5zYKfuOGx5DHKWmwF0792wELA'); // TODO: Set a proper token.
