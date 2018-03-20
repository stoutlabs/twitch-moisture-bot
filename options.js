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
