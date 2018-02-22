const path = require("path");
const fs = require("fs");
const axios = require("axios");

const datafile = path.join(__dirname, "fortnite-data.json");
const storagefile = path.join(__dirname, "fortnite-stored.json");
let myData = {};

module.exports = class FNscores {
  constructor(apiURL, apiKey) {
    this.apiURL = apiURL;
    this.apiKey = apiKey;
    this.solowins = 0;
    this.duowins = 0;
    this.solokills = 0;
    this.duokills = 0;
  }

  fetchData() {
    try {
      const statsString = fs.readFileSync(datafile);
      return JSON.parse(statsString);
    } catch (err) {
      return [];
    }
  }

  fetchStoredData() {
    try {
      const storedStatsString = fs.readFileSync(storagefile);
      return JSON.parse(storedStatsString);
    } catch (err) {
      return [];
    }
  }

  storeInitialStats() {
    const stats = this.fetchData();
    const soloStats = stats.stats.p2;
    const duoStats = stats.stats.p10;
    const squadStats = stats.stats.p9;

    const initialData = {
      solo: {
        matches: soloStats.matches.value,
        kills: soloStats.kills.value,
        top1: soloStats.top1.value,
        top5: soloStats.top5.value
      },
      duo: {
        matches: duoStats.matches.value,
        kills: duoStats.kills.value,
        top1: duoStats.top1.value,
        top5: duoStats.top5.value
      },
      squad: {
        matches: squadStats.matches.value,
        kills: squadStats.kills.value,
        top1: squadStats.top1.value,
        top5: squadStats.top5.value
      }
    };

    fs.writeFileSync(storagefile, JSON.stringify(initialData));
    return "New session data saved!";
  }

  refreshStats() {
    const _self = this;
    const theURL = this.apiURL;
    const theKey = this.apiKey;
    console.log("theURL", theURL);

    return axios
      .get(theURL, {
        headers: {
          "TRN-Api-Key": theKey
        }
      })
      .then(function(response) {
        myData = response.data;
        //console.log(myData);
        fs.writeFileSync(datafile, JSON.stringify(myData));
      })
      .then(() => {
        console.log("Stats updated.");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  addWin(winType = "solo", numkills = 0) {
    let msg = "";

    numkills = Number(numkills);

    if (winType === "duo") {
      this.duowins++;
      this.duokills += numkills;
      msg = "Duos wins increased! ";
    } else {
      this.solowins++;
      this.solokills += numkills;
      msg = "Solo wins increased! ";
    }

    msg += `We now have ${this.solowins} solo and ${
      this.duowins
    } duos wins in Fortnite today!! ${
      this.solokills
    } fools have been toasted in solo play, and ${this.duokills} in duos.`;

    //extra memes
    if (Number(this.duowins) + Number(this.solowins) > 4) {
      msg += " PogChamp";
    }

    return msg;
  }

  editWins(winType, val) {
    const errorMsg = "Here's an example: !editscore duo 4";

    if (!Number.isInteger(Number(val))) {
      return "That's not a number, dude! " + errorMsg;
    }

    if (winType == "solo") {
      this.solowins = val;
      return "Solo wins updated, now set to: " + this.solowins;
    } else if (winType === "duo") {
      this.duowins = val;
      return "Duos wins updated, now set to: " + this.duowins;
    } else {
      return "Ayyy, wiseguy - only 'solo' and 'duo' are in use. " + errorMsg;
    }
  }

  resetWins() {
    this.solowins = this.duowins = 0;
    return "Wins reset! Use '!addwin solo [kills]' and '!addwin duo [kills]' to add more.";
  }

  showHelp() {
    return "Use '!addwin solo [kills]' and '!addwin duo [kills]' to add wins, '!editwins [solo/duo] [amount]' to edit wins, and '!resetwins' to reset wins.";
  }

  showWins() {
    let msg = `We now have ${this.solowins} solo and ${
      this.duowins
    } duos wins today!! ${
      this.solokills
    } fools have been toasted in solo play, and ${this.duokills} in duos.`;

    //extra memes
    if (Number(this.duowins) + Number(this.solowins) > 4) {
      console.log(Number(this.duowins) + Number(this.solowins));
      msg += " PogChamp";
    }
    if (Number(this.duowins) + Number(this.solowins) > 9) {
      console.log(Number(this.duowins) + Number(this.solowins));
      msg += " DatSheffy";
    }

    return msg;
  }

  //fortnite tracking stuff
  showLastMatch(matchData) {
    let matchType = matchData.playlist;
    let placement = "";

    if (matchType === "p10") {
      matchType = "duos";
    } else if (matchType === "p9") {
      matchType = "squad";
    } else {
      matchType = "solo";
    }

    const matches = matchData.matches;
    const wins = matchData.top1;
    const top5 = matchData.top5;
    const top5Diff = wins - top5;

    if (top5 > 0) {
      placement += ` ${top5} top 5 finishes`;
      if (top5Diff > 0) {
        placement += ` including`;
      }
    }

    if (wins > 0) {
      placement += ` ${wins} + wins!`;
    }

    if (wins == 0 && top5 == 0) {
      placement = "no wins... PJSalt";
    }

    let matchMsg = `In the past ${matches} rounds, we were running the ${matchType} playlist. We killed ${
      matchData.kills
    } poor souls, and finished with: ${placement}.`;
    return matchMsg;
  }

  getStats(statType, gameType = "") {
    let msg = "";

    //check for valid stat type here... soon
    const stats = this.fetchData();
    const soloStats = stats.stats.p2;
    const duoStats = stats.stats.p10;
    const squadStats = stats.stats.p9;
    const recentMatches = stats.recentMatches;

    const storedStats = this.fetchStoredData();

    //const lifetimeStats = stats.lifeTimeStats;

    switch (statType) {
      case "help":
        return "You can get the following stats: allwins (solo/duo/total), allkills (solo/duo/total), wins (solo/duo), kills (solo/duo), matches (solo/duo), recent";
        break;

      case "allwins":
        if (gameType === "duo") {
          return "Total duo wins to date: " + duoStats.top1.value;
        } else if (gameType === "solo") {
          return "Total solo wins to date: " + soloStats.top1.value;
        } else if (gameType === "total") {
          return (
            "Total overall wins (solo, duo, and squad): " +
            (Number(duoStats.top1.value) +
              Number(soloStats.top1.value) +
              Number(squadStats.top1.value))
          );
        } else {
          return "Use 'allkills duo', 'allkills solo', or 'allkills total'";
        }
        break;

      case "wins":
        console.log("storedStats.duo", storedStats.duo);
        if (gameType === "duo") {
          return (
            "Total duo wins this session: " +
            (Number(duoStats.top1.value) - Number(storedStats.duo.top1))
          );
        } else {
          return (
            "Total solo wins this session: " +
            (Number(soloStats.top1.value) - Number(storedStats.solo.top1))
          );
        }
        break;

      case "allkills":
        if (gameType === "duo") {
          return "Total duo kills to date: " + duoStats.kills.value;
        } else if (gameType === "solo") {
          return "Total solo kills to date: " + soloStats.kills.value;
        } else if (gameType === "total") {
          return (
            "Total overall kills (solo, duo, and squad): " +
            (Number(duoStats.kills.value) +
              Number(soloStats.kills.value) +
              Number(squadStats.kills.value))
          );
        } else {
          return "Use 'allkills duo', 'allkills solo', or 'allkills total'";
        }
        break;

      case "kills":
        if (gameType === "duo") {
          return (
            "Total duo kills this session: " +
            (Number(duoStats.kills.value) - Number(storedStats.duo.kills))
          );
        } else if (gameType === "solo") {
          return (
            "Total solo kills this session: " +
            (Number(soloStats.kills.value) - Number(storedStats.solo.kills))
          );
        } else {
          return "Use 'kills duo' or 'kills solo', that wasn't recognized.";
        }
        break;

      case "allmatches":
        if (gameType === "duo") {
          return "Total duo matches to date: " + duoStats.matches.value;
        } else {
          return "Total solo matches to date: " + soloStats.matches.value;
        }
        break;

      case "matches":
        if (gameType === "duo") {
          return (
            "Total duo matches this session: " +
            (Number(duoStats.matches.value) - Number(storedStats.duo.matches))
          );
        } else {
          return (
            "Total solo matches this session: " +
            (Number(soloStats.matches.value) - Number(storedStats.solo.matches))
          );
        }
        break;

      case "recent":
        //console.log(recentMatches[0]);
        //return "In progress...";
        return this.showLastMatch(recentMatches[0]);
        break;

      default:
        return "Command not recognized.";
    }
  }
};
