import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { getSpotifyAccessToken } from './spotifyAuth';

const spotifyApi = new SpotifyWebApi();

function MusicPlayer({ genre }) {
  const [currentTrack, setCurrentTrack] = useState('');
  const [nextTrack, setNextTrack] = useState('');

  useEffect(() => {
    const fetchTokenAndPlayMusic = async () => {
      const token = await getSpotifyAccessToken();

      if (!token) {
        console.error('Failed to get access token');
        return;
      }

      spotifyApi.setAccessToken(token);

      // Search for playlists by genre
      spotifyApi.searchPlaylists(genre)
        .then((data) => {
          if (data.playlists?.items.length > 0) {
            const playlistUri = data.playlists.items[0].uri;
            
            // Play the first playlist
            spotifyApi.play({ context_uri: playlistUri });

            // Get current track
            spotifyApi.getMyCurrentPlayingTrack()
              .then((trackData) => {
                setCurrentTrack(trackData?.item?.name || 'Unknown');
              })
              .catch((error) => console.error('Error fetching current track:', error));

            // Get recently played tracks as the next track
            spotifyApi.getMyRecentlyPlayedTracks()
              .then((nextData) => {
                setNextTrack(nextData?.items?.[0]?.track?.name || 'Unknown');
              })
              .catch((error) => console.error('Error fetching next track:', error));
          } else {
            console.error('No playlists found for the selected genre.');
          }
        })
        .catch((error) => console.error('Error searching playlists:', error));
    };

    fetchTokenAndPlayMusic();
  }, [genre]);

  return (
    <div className="music-player">
      <p>Currently Playing: {currentTrack}</p>
      <p>Playing Next: {nextTrack}</p>
    </div>
  );
}

export default MusicPlayer;
