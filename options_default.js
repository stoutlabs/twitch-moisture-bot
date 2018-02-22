//update the username and password with your bot's own values, or this will not work.
//you can change the channel that you want to use it in, too
var options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: "your_bot_twitch_username",
    password: "oauth:****YOUR twitch oauth KEY (for the account above)*****"
  },
  channels: ["your_channel_name"],
  apiURL: "https://api.fortnitetracker.com/v1/profile/pc/YOUR_EPIC_USERNAME",
  apiKey: "YOUR FORTNITE TRACKER API KEY"
};

module.exports = options;
