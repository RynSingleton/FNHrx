import axios from 'axios';

const CLIENT_ID = 'a5f118ccecf34b97995bb66dd157585d';
const CLIENT_SECRET = '178dfa98c6ba4d7899bb64518c474476';

export const getSpotifyAccessToken = async () => {
  const url = 'https://accounts.spotify.com/api/token';
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const encodedCredentials = btoa(credentials); // Base64 encode

  try {
    const response = await axios.post(url, 
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};
