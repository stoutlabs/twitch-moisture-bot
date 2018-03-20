require("dotenv").config();

const tmi = require("tmi.js");
const options = require("./options.js");
const client = new tmi.client(options);
const autoRefresh = true;

//initialize our bot modes (currently just the fortnite mode)
const fnscores = require("./modes/fortnite-scores.js");
const fortnite = new fnscores(options.fortnite.apiURL, options.fortnite.apiKey);

//connect to Twitch
client.connect();

//delay helper promise fn, will move to a /lib soon
function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

//connection message
client.on("connected", (address, port) => {
  if (options.announce.connect) {
    client
      .action(options.channels[0], "Moisture_Bot v0.9b Beta ::: Now Online DatSheffy")
      .then(sleeper(2000))
      .then(() => {
        client.action(
          options.channels[0],
          "Type !help to get commands. Mods can type !newsession to start a new stats session."
        );
      })
      .then(() => {
        if (autoRefresh) {
          autoRefresher();
        }
        return;
      })
      .catch(e => {
        console.log("error: ", e);
      });
  }
});
//---- end connection message ----

//handle chat interactions
client.on("chat", (channel, user, message, self) => {
  //ignore self
  //here

  //get broadcaster name here by removing # from the channel name, since they aren't usually listed as mods
  const channelName = channel.replace(/^#/, "");

  //convert to lowercase and split line into array (for parameter usage)
  const msgArray = message.toLowerCase().split(" ");

  //moderator commands list
  if (user.mod || user.username === channelName) {
    switch (msgArray[0]) {
      case "!help":
        client.action(channelName, fortnite.showHelp());
        break;

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
    }
  }

  //all users commands list
  switch (msgArray[0]) {
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
});

//auto-call stats refresher
const autoRefresher = () => {
  fortnite
    .refreshStats()
    .then(() => {
      //client.action(options.channels[0], "Stats updated!");
      console.log("api stats updated!");
    })
    .then(() => {
      setTimeout(autoRefresher, 61000);
    })
    .catch(e => {
      console.log("error", e);
    });
};
