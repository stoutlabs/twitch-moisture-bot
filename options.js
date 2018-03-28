const options = {
  options: {
    debug: false
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
  client_id: process.env.MB_TWITCH_CLIENTID,
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
      mins: 60
    }
  }
};

module.exports = options;
