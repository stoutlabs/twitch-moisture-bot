//const LastFmNode = require("lastfm").LastFmNode;
const options = require("../options.js");
const axios = require("axios");

const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${
  options.modes.lastfm.username
}&api_key=${options.modes.lastfm.apiKey}&limit=2&format=json`;

const fetchSong = () => {
  return axios
    .get(url)
    .then(response => {
      //console.log(response.data.recenttracks.track[0]);
      return response.data.recenttracks.track[0];
    })
    .catch(e => {
      console.log("song fetch error", e);
      return e;
    });
};

const fetchLastSong = () => {
  return axios
    .get(url)
    .then(response => {
      //console.log(response.data.recenttracks);
      return response.data.recenttracks.track[1];
    })
    .catch(e => {
      console.log("song fetch error", e);
      return e;
    });
};

module.exports = { fetchSong, fetchLastSong };
