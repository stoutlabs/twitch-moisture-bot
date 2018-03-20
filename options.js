const options = {
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
  },
  modes: {
    lastfm: {
      enabled: true,
      apiKey: process.env.MB_LASTFM_APIKEY,
      apiSecret: process.env.MB_LASTFM_APISECRET,
      username: "whoswags"
    },
    moisturetimer: {
      enabled: true,
      mins: 2
    }
  }
};

module.exports = options;
