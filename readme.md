# Moisture_Bot

A basic Twitch bot, currently used to track FortNite stats during a stream. W.I.P., use at your own risk!!

### Requirements

1. Node.js (version 8.0.2 or higher) installed on your computer. [Get Node.js Here](https://nodejs.org/en/download/)
2. [A twitch account for your new bot.](https://twitch.tv/)
3. The twitch oauth token for your bot's account. [Get one here](https://twitchapps.com/tmi/)
4. A Fortnite Tracker [api key](https://fortnitetracker.com/site-api)

### Installation Instructions

1. Install Node.js on your machine, if not installed already. (It's small and lightweight, it'll run on a potato!)
2. Download this repo into a directory of your choice
3. Edit the 'options.js' file, updating the appropriate values for: your twitch bot's account name and oauth token, channel name, and your Fortnite Tracker API URL/key

4. Open a command prompt in the directory (In Windows, right click and select "open command prompt here")
5. At the prompt, type: npm install
6. Your bot is now ready to be run! (You only have to run the above command once.)

### Usage

* Running the bot is easy! Just type the following at a command prompt, opened in this bot's directory: node app.js
* You should see some connection messages appear there, and you should also see your bot running in your channel's chat!
* I'll update this soon! See the code for now, or type !mbhelp and !getstats help in your chat
* You can stop the bot at any time by pressing CTRL+C in the command prompt window, or by just closing the window.

### Current Requests/To-Dos

* Connect to Last.Fm to pull current song playing (new mode)

### Special Thanks

* This was made SO much easier thanks to the folks that made tmi.js, axios, and the fortnite tracker api! (links to come)
