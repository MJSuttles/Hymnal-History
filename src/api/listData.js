import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getListsAndSongs = async () => {
  try {
    // Fetch the list
    const listResponse = await fetch(`${endpoint}/lists.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const listData = await listResponse.json();

    if (!listData || !listData.songIds) {
      throw new Error('No songs found in the specified list.');
    }

    // Fetch all songs
    const songsResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const songsData = await songsResponse.json();

    // Filter songs based on 'songs' in the list and extract only their names
    const songNames = listData.songs.map((songId) => songsData[songId]?.title || 'Unknown Title');

    return {
      listName: listData.name,
      songNames,
    };
  } catch (error) {
    console.error('Error fetching song names for list', error);
    throw error;
  }
};

const getSingleListWithSongs = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/lists/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((listData) => {
        if (!listData.songIds || listData.songIds.length === 0) {
          // Resolve immediately if no songIds
          resolve({ list: listData, songs: [] });
          return;
        }

        // Fetch all songs using their IDs in parallel
        const songFetchPromises = listData.songIds.map(
          (songId) =>
            fetch(`${endpoint}/songs/${songId}.json`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((response) => {
                if (response.ok) return response.json();
                // Return null if the song is not found (e.g., deleted)
                return null;
              })
              .catch(() => null), // Return null if there's an error fetching the song
        );

        // Wait for all fetches to complete
        Promise.all(songFetchPromises)
          .then((songs) => {
            // Map songIds to fetched songs to maintain order, filtering out null values
            const orderedSongs = listData.songIds.map((songId) => songs.find((song) => song?.firebaseKey === songId)).filter((song) => song); // Remove null or undefined songs

            resolve({ ...listData, songs: orderedSongs });
          })
          .catch(reject); // Handle errors in fetching songs
      })
      .catch(reject); // Handle errors in fetching the list
  });

export { getListsAndSongs, getSingleListWithSongs };
