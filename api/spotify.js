// /api/spotify.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  // Requesting access token from Spotify
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  // Using the access token to access the Spotify Web API
  const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: 'Bearer ' + data.access_token },
  });

  const currentlyPlaying = await spotifyResponse.json();

  if (currentlyPlaying.error || !currentlyPlaying.is_playing) {
    res.status(200).json({ message: 'No track is currently playing.' });
  } else {
    res.status(200).json({ track: currentlyPlaying.item.name, artist: currentlyPlaying.item.artists[0].name });
  }
};
