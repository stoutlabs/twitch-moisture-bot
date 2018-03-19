# Moisture_Bot

[![nodejs](https://img.shields.io/badge/node.js-8.5.0-brightgreen.svg?style=flat-square)](https://nodejs.org/en/)
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg?style=flat-square)](paypal.me/stoutlabs/5.00)

A basic Twitch bot, currently used to track FortNite stats during a stream. W.I.P., use at your own risk!!

---

### Requirements

1.  Node.js (version 8.5.0 or higher) installed on your computer. [Get Node.js Here](https://nodejs.org/en/download/)
2.  [A twitch account for your new bot.](https://twitch.tv/)
3.  The twitch oauth token for your bot's account. [Get one here](https://twitchapps.com/tmi/)
4.  A Fortnite Tracker [api key](https://fortnitetracker.com/site-api)

### Installation Instructions

1.  Install Node.js on your machine, if not installed already. (It's small and lightweight, it'll run on a potato!)
2.  Clone this git repo into a directory of your choice
3.  Open the 'sample.env' file, and edit the values for your bot.
4.  Rename the 'sample.env' file to just '.env'
5.  Open a command prompt in the directory (In Windows, right click and select "open command prompt here")
6.  At the prompt, type: npm install
7.  Your bot is now ready to be run! (Note: You only have to do these steps once.)

### Usage

* Running the bot is easy! Open a command prompt from the directory your bot is in, and type: node app.js
* You should see some connection messages appear there, and you should also see your bot running in your channel's chat!
* I'll update this soon! See the code for now, or type !help or !getstats help in your chat
* You can stop the bot at any time by pressing CTRL+C in the command prompt window, or by just closing the window.

### Current Requests/To-Dos

* Connect to Last.Fm to pull current song playing (new mode)
* Browser interface
* Much much more... this is just the start!

### Special Thanks

* This was made SO much easier thanks to the folks that made tmi.js, axios, and the fortnite tracker api! (links to come)
