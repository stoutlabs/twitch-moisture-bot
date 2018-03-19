require("dotenv").config();

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
    username: process.env.MB_TWITCH_USERNAME,
    password: process.env.MB_TWITCH_AUTH
  },
  channels: [process.env.MB_TWITCH_CHANNEL],
  fortnite: {
    apiURL: process.env.MB_API_URL,
    apiKey: process.env.MB_API_KEY
  },
  announce: {
    connect: false
  }
};

module.exports = options;
