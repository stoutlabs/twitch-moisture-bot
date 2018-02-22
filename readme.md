#Moisture_Bot

A Twitch bot used to track FortNite wins during a stream, fairly basic in functionality for now.

#Requirements

1. Node.js (8.0 or higher) running on your machine. (link here)
2. A twitch account for your new bot. (link here)
3. The twitch oauth token for your bot's account. (link here)

#Installation Instructions

* Install Node.js on your machine, if not installed already.
* Download this repo into a directory of your choice
* Edit the 'options.js' file
  * Update the appropriate values for your twitch bot's account name and oauth token, channel, and apiURL/key
* Open a command prompt in the directory (In Windows, right click and select "open command prompt here")
* At the prompt, type: npm install
* Your bot is now ready to be run! (You only have to run the above command once.)

#Usage

* Running the bot is easy! Just type the following at a command prompt, opened in this bot's directory: node app.js
* You should see some connection messages appear there, and you should also see your bot running in your channel's chat!
* I'll update this soon! See the code for now, or type !mbhelp and !getstats help in your chat
* You can stop the bot at any time by pressing CTRL+C in the command prompt window, or by just closing the window.

#Current Requests/To-Dos

* Track Kills (e.g. !addwin duo 8 would add a duos win with 8 kills)
* Get Fortnite tracker API connected & build some call requests to it (To pull wins/kills/etc from that instead of needing to enter manually)
* Add storage/cache + delayed interval to call stats API

#Special Thanks

* This was made SO much easier thanks to the folks that made tmi.js, axios, and the fortnite tracker api! (links to come)
