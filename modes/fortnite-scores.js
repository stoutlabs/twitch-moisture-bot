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

  showHelp() {
    return "Type '!getstats help' for a list of fortnite stats commands. More coming soon...";
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

    const matches = Number(matchData.matches);
    const wins = Number(matchData.top1);
    const top5 = Number(matchData.top5);
    const top5Diff = wins - top5;

    if (top5 > 0) {
      placement += ` ${top5} top 5 finishes`;
      if (top5Diff > 0) {
        placement += ` including`;
      }
    }

    if (wins > 0) {
      placement += ` ${wins} wins!`;
    }

    if (wins == 0 && top5 == 0) {
      placement = "no wins... PJSalt";
    }

    let matchMsg = `In the past ${matches} rounds, we were running the ${matchType} playlist. We killed ${
      matchData.kills
    } poor souls, and finished with ${placement}`;
    return matchMsg;
  }

  getStats(statType, gameType = "") {
    let msg = "";

    //check for valid stat type here... soon
    const stats = this.fetchData();
    const storedStats = this.fetchStoredData();

    const soloStats = stats.stats.p2;
    const duoStats = stats.stats.p10;
    const squadStats = stats.stats.p9;
    const recentMatches = stats.recentMatches;
    //const lifetimeStats = stats.lifeTimeStats;

    switch (statType) {
      case "help":
        return "You can get the following stats: allwins, allkills, allmatches, wins, kills, matches, recent";
        break;

      case "allwins":
        let allWinsMessage = "";
        const allWinsBigTotal =
          Number(duoStats.top1.value) + Number(soloStats.top1.value) + Number(squadStats.top1.value);

        allWinsMessage = `Total overall wins: ${soloStats.top1.value} solo, ${duoStats.top1.value} duo, and ${
          squadStats.top1.value
        } squad. Total combined: `;
        allWinsMessage += allWinsBigTotal;

        return allWinsMessage;
        break;

      case "wins":
        let winsMessage = "";

        const winsSolo = Number(soloStats.top1.value) - Number(storedStats.solo.top1);
        const winsDuo = Number(duoStats.top1.value) - Number(storedStats.duo.top1);
        const winsSquad = Number(squadStats.top1.value) - Number(storedStats.squad.top1);
        const winsTot = winsSolo + winsDuo + winsSquad;

        winsMessage += `Total wins this session: ${winsTot} (${winsSolo} solo, ${winsDuo} duo, ${winsSquad} squad)`;

        //lol - add PJSalt memes
        if (winsTot === 0) {
          winsMessage += " PJSalt";
        }

        //add big win memes
        if (winsTot > 5) {
          winsMessage += " PogChamp";
        }

        return winsMessage;
        break;

      case "allkills":
        let allKillsMessage = "";
        const totWinsSolo = Number(soloStats.kills.value);
        const totWinsDuo = Number(duoStats.kills.value);
        const totWinsSquad = Number(squadStats.kills.value);
        const allKillsBigTotal = totWinsSolo + totWinsDuo + totWinsSquad;

        allKillsMessage = `Total overall kills: ${allKillsBigTotal} (${totWinsSolo} solo, ${totWinsDuo} duo, and ${totWinsSquad} squad)`;

        return allKillsMessage;
        break;

      case "kills":
        let curKillsMessage = "";
        const curKillsSolo = Number(soloStats.kills.value) - Number(storedStats.solo.kills);
        const curKillsDuo = Number(duoStats.kills.value) - Number(storedStats.duo.kills);
        const curKillsSquad = Number(squadStats.kills.value) - Number(storedStats.squad.kills);
        const curKillsBigTotal = curKillsSolo + curKillsDuo + curKillsSquad;

        curKillsMessage = `Total kills this session: ${curKillsBigTotal} (${curKillsSolo} solo, ${curKillsDuo} duo, and ${curKillsSquad} squad)`;

        return curKillsMessage;
        break;

      case "allmatches":
        let allMatchesMessage = "";
        const allMatchesSolo = Number(soloStats.matches.value);
        const allMatchesDuo = Number(duoStats.matches.value);
        const allMatchesSquad = Number(squadStats.matches.value);
        const allMatchesBigTotal = allMatchesSolo + allMatchesDuo + allMatchesSquad;

        allMatchesMessage = `Total matches to date: ${allMatchesBigTotal} (${allMatchesSolo} solo, ${allMatchesDuo} duo, ${allMatchesSquad} squad)`;

        return allMatchesMessage;
        break;

      case "matches":
        let curMatchesMessage = "";
        const curMatchesSolo = Number(soloStats.matches.value) - Number(storedStats.solo.matches);
        const curMatchesDuo = Number(duoStats.matches.value) - Number(storedStats.duo.matches);
        const curMatchesSquad = Number(squadStats.matches.value) - Number(storedStats.squad.matches);
        const curMatchesBigTotal = curMatchesSolo + curMatchesDuo + curMatchesSquad;

        curMatchesMessage = `Total matches this session: ${curMatchesBigTotal} (${curMatchesSolo} solo, ${curMatchesDuo} duo, ${curMatchesSquad} squad)`;
        return curMatchesMessage;
        break;

      case "recent":
        return this.showLastMatch(recentMatches[0]);
        break;

      default:
        return "Command not recognized.";
    }
  }
};
