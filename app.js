require("dotenv").config();
const tmi = require("tmi.js");
const axios = require("axios");

const options = require("./options.js");
const autoRefreshStats = true;

let streamIsLive = true;
let isLiveTimerID = undefined;

// fortnite tracking mode vars
const fnscores = require("./modes/fortnite-scores.js");
const fortnite = new fnscores(options.fortnite.apiURL, options.fortnite.apiKey);
let fortniteTimerID = undefined;

// lastFM (current/prev song) mode vars
const lastFM = require("./modes/lastfm");

// moisture reminder mode vars
let moistureTimerID = undefined;
const moistureTime = options.modes.moisturetimer.mins * 60 * 1000;

//connect to Twitch
const client = new tmi.client(options);
client.connect();

//connection message/setup
client.on("connected", (address, port) => {
  if (options.announce.connect) {
    client
      .action(options.channels[0], "Moisture_Bot v1.1 ::: Now Online DatSheffy")
      .then(sleeper(2000))
      .then(() => {
        client.action(
          options.channels[0],
          "Type !help to get commands. Mods can type !newsession to start a new stats session."
        );
      })
      .catch(e => {
        console.log("error: ", e);
      });
  }
  if (autoRefreshStats) {
    fortniteTimerID = setTimeout(fortniteAutoStats, 65000);
  }
  if (options.modes.moisturetimer.enabled) {
    moistureTimerID = setTimeout(moistureTimer, moistureTime, options.modes.moisturetimer.mins);
  }
  checkChannelStatus();
});
//---- end connection message ----

//handle chat interactions
client.on("chat", (channel, user, message, self) => {
  //ignore self here?

  //get broadcaster name here by removing # from the channel name, since they aren't usually listed as mods
  const channelName = channel.replace(/^#/, "");

  //convert to lowercase and split line into array (for parameter usage)
  const msgArray = message.toLowerCase().split(" ");

  //moderator commands list
  if (user.mod || user.username === channelName) {
    switch (msgArray[0]) {
      case "!newsession":
        client.action(channelName, fortnite.storeInitialStats());
        break;

      case "!refreshstats":
        client.action(channelName, "Fetching new Fortnite stats, one moment...");
        //fortnite.refreshStats();
        fortnite.refreshStats().then(() => {
          client.action(channelName, "Stats updated!");
        });
        break;

      case "!startmoisture":
        clearTimeout(moistureTimerID);
        const moistureTime = options.modes.moisturetimer.mins * 60 * 1000;
        moistureTimerID = setTimeout(moistureTimer, moistureTime, options.modes.moisturetimer.mins);
        client.action(channelName, "Moisture timer (re)started! Type !stopmoisture to end.");
        break;

      case "!stopmoisture":
        clearTimeout(moistureTimerID);
        client.action(channelName, "Moisture reminders now off. Type !startmoisture to restart timer.");
        break;

      case "!startstats":
        clearTimeout(fortniteTimerID);
        fortniteTimerID = setTimeout(fortniteAutoStats, 65000);
        client.action(channelName, "Fortnite stats tracking (re)started! Type !stopstats to end.");
        break;

      case "!stopstats":
        clearTimeout(fortniteTimerID);
        client.action(channelName, "Fortnite stats tracking stopped. Type !startstats to restart.");
        break;
      case "!channelstatus":
        checkChannelStatus();
        break;
    }
  }

  //all users commands list
  switch (msgArray[0]) {
    case "!help":
      client.action(channelName, fortnite.getStats("help"));
      break;

    case "!wins":
      client.action(channelName, fortnite.getStats("wins"));
      break;

    case "!kills":
      client.action(channelName, fortnite.getStats("kills"));
      break;

    case "!getstats":
      client.action(channelName, fortnite.getStats(msgArray[1], msgArray[2]));
      break;
  }

  if (options.modes.lastfm.enabled) {
    switch (msgArray[0]) {
      case "!song":
        lastFM
          .fetchSong()
          .then(track => {
            const artist = Object.values(track.artist)[0];
            const album = Object.values(track.album)[0];
            const song = track.name;
            const songMsg = `${artist} - ${song} (${album})`;
            client.action(channelName, songMsg);
          })
          .catch(e => {
            console.log("fetchSong error:", e);
          });

        break;

      case "!lastsong":
        lastFM
          .fetchLastSong()
          .then(track => {
            const pArtist = Object.values(track.artist)[0];
            const pAlbum = Object.values(track.album)[0];
            const pSong = track.name;
            const pSongMsg = `${pArtist} - ${pSong} (${pAlbum})`;
            client.action(channelName, pSongMsg);
          })
          .catch(e => {
            console.log("fetchSong error:", e);
          });
        break;
    }
  }
});

// ----------------------
// Util functions
// ----------------------

const sleeper = ms => {
  return x => new Promise(resolve => setTimeout(() => resolve(x), ms));
};

//fortnite recursive stats refresher
const fortniteAutoStats = () => {
  fortnite
    .refreshStats()
    .then(() => {
      //client.action(options.channels[0], "Stats updated!");
      console.log("api stats updated!");
    })
    .then(() => {
      fortniteTimerID = setTimeout(fortniteAutoStats, 65000);
    })
    .catch(e => {
      console.log("error", e);
    });
};

//moisture reminders recursive timer
const moistureMessage = mins => {
  return `${mins} minutes have passed, strimmer! Moisturize! DrinkPurple`;
};

// moisture reminders recursive timer
const moistureTimer = minutes => {
  const millsecs = minutes * 60 * 1000;
  const channelName = options.channels[0];

  client
    .action(channelName, moistureMessage(minutes))
    .then(() => {
      moistureTimerID = setTimeout(moistureTimer, millsecs, minutes);
    })
    .catch(e => {
      console.log("moistureTimer error:", e);
    });
};

// check if channel is live - this is all a bit messy for now, sorry!
const checkChannelStatus = () => {
  let channelName = options.channels[0];

  if (channelName.charAt(0) === "#") {
    channelName = channelName.replace(/^#/, "");
  }

  // check Twitch API for 'stream' info. It returns null if stream is offline.
  axios
    .get(`https://api.twitch.tv/kraken/streams/${channelName}?client_id=${options.client_id}`)
    .then(results => {
      if (results.data.stream !== null && streamIsLive === false) {
        let newStreamMsg = `Stream recently went live - hello, @${channelName}!`;

        // restart fortnite stats if the game == fortnite
        if (results.data.stream.game === "Fortnite") {
          newStreamMsg += ` Fortnite is detected, I'm restarting the stats tracker. Type !newsession if this is a new stream.`;
          clearTimeout(fortniteTimerID);
          fortniteAutoStats();
        }

        // if moistureTimer is enabled, restart it too
        if (options.modes.moisturetimer.enabled) {
          newStreamMsg += ` I've also enabled the Moisture reminders for you. Type !stopmoisture to stop them.`;
          moistureTimerID = setTimeout(moistureTimer, moistureTime, options.modes.moisturetimer.mins);
        }

        client.action(channelName, newStreamMsg);
        streamIsLive = true;
      } else if (results.data.stream === null && streamIsLive === true) {
        // if stream recently went offline, do these:
        clearTimeout(fortniteTimerID);
        clearTimeout(moistureTimerID);
        const shutdownMsg =
          "The stream appears to be offline. Shutting down Fortnite tracker auto-updates and moisture reminders. I'll check back every 5 minutes...";
        client.action(channelName, shutdownMsg);
        streamIsLive = false;
      }
    })
    .catch(e => {
      console.log("error getting live status: ", e);
    });

  // start recursive calls to this function (once every 5 mins should be good?)
  isLiveTimerID = setTimeout(checkChannelStatus, 5 * 60 * 1000);
};
