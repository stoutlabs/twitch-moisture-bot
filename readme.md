# Moisture_Bot

[![nodejs](https://img.shields.io/badge/node.js-8.5.0-brightgreen.svg?style=flat-square)](https://nodejs.org/en/)
[![Build Status](https://travis-ci.org/stoutlabs/twitch-moisture-bot.svg?branch=master)](https://travis-ci.org/stoutlabs/twitch-moisture-bot)
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg?style=flat-square)](https://paypal.me/stoutlabs/5.00)

A basic Twitch bot, currently used to track FortNite stats during a stream. W.I.P., use at your own risk!!

---

### Requirements

1.  Node.js (version 8.5.0 or higher) installed on your computer. [Get Node.js Here](https://nodejs.org/en/download/)
2.  [A twitch account for your new bot.](https://twitch.tv/)
3.  The twitch oauth token for your bot's account. [Get one here](https://twitchapps.com/tmi/)
4.  To enable direct calls to the Twitch API (to check if the stream is live), we also need an app Client ID from Twitch. Go to [dev.twitch.tv](https://dev.twitch.tv/), and make a new app. I called mine 'MoistureBot ChannelStatus'. All you really need is the 'client ID'. (Note: I suspect that I may have done something wrong here... as one would think we could use the OAuth token above for this too. I'm looking into it, but this will work for now.)
5.  A Fortnite Tracker [api key](https://fortnitetracker.com/site-api)
6.  If the Last.FM mode is desired, you will need to [get a Last.fm API key](https://www.last.fm/api/account/create) too.

### Installation Instructions

1.  Install Node.js on your machine, if not installed already. (It's small and lightweight, it'll run on a potato!)
2.  Clone this git repo into a directory of your choice
3.  Open the 'sample.env' file, and edit the values for your bot.
4.  Rename the 'sample.env' file to just '.env'
5.  Open a command prompt in the directory (In Windows, right click and select "open command prompt here")
6.  At the prompt, type: npm install
7.  Your bot is now ready to be run! (Note: You only have to do these steps once.)
8.  Note: If you plan to host this on a server, all of the .env file values need to be added to your server's environment variables. There are many ways to do this, depending on your server setup... google is your friend. (In my case, on Ubuntu 16.04, those are stored in /etc/environment. I simply edit those values and then logout/login to get those updated vars into my user's environment... and then restart the bot.)

### Usage

* Running the bot is easy! Open a command prompt from the directory your bot is in, and type: node app.js (or npm start)
* You should see some connection messages appear there, and you should also see your bot running in your channel's chat!
* I'll continue updating this as I have time! See the code for now, or type !help or !getstats help in your chat
* You can stop the bot at any time by pressing CTRL+C in the command prompt window, or by just closing the window.

### Current Requests/To-Dos

* Browser interface
* Much much more... this is just the start!

### Special Thanks

* This was made SO much easier thanks to the folks that made tmi.js, axios, and the fortnite tracker api! (links to come)
