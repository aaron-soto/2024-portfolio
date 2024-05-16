const axios = require('axios');
const qs = require('qs');

module.exports = async (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const getAccessToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({ grant_type: 'client_credentials' });

    try {
      const response = await axios.post(tokenUrl, data, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error.response ? error.response.data : error.message);
      throw new Error('Failed to get access token');
    }
  };

  const getCurrentlyPlayingTrack = async (accessToken) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting currently playing track:', error.response ? error.response.data : error.message);
      throw new Error('Failed to get currently playing track');
    }
  };

  try {
    const accessToken = await getAccessToken();
    const trackInfo = await getCurrentlyPlayingTrack(accessToken);
    res.status(200).json(trackInfo);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
