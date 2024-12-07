import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getListsAndSongs = async (uid) => {
  try {
    // Fetch the lists
    const listResponse = await fetch(`${endpoint}/lists.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const listData = await listResponse.json();

    // Fetch the songs
    const songResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const songData = await songResponse.json();

    // Filter and map the lists by uid
    const filteredLists = listData
      ? Object.entries(listData)
          .map(([key, value]) => ({
            ...value,
            firebaseKey: key, // Add firebaseKey to each list
          }))
          .filter((list) => list && list.uid === uid) // Filter lists by uid
      : [];

    // Transform list and song into a structure which will display the data correctly on Bootstrap cards on Song Lists page
    const myLists = filteredLists.map((list) => {
      // Extract song IDs from list.songIds
      const songIds = list.songIds ? Object.keys(list.songIds) : [];

      // Match song IDs with songData (from the songs 'GET' call above) to get song details needed for display on Bootstrap cards on Song Lists page
      const songs = songIds
        .map((songId) => {
          const song = songData[songId];
          return song
            ? {
                firebaseKey: songId,
                title: song.title,
              }
            : null;
        })
        .filter((song) => song); // Remove null values for unmatched IDs (e.g., deleted songs)

      return {
        firebaseKey: list.firebaseKey,
        date: list.date,
        congregation: list.congregation,
        songs,
      };
    });

    console.log('Final structured data:', myLists);

    return myLists;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const getSingleListWithSongs = async (uid, firebaseKey) => {
  try {
    // Fetch the single list
    const listResponse = await fetch(`${endpoint}/lists/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const listData = await listResponse.json();

    // Verify if the list exists and matches the UID
    if (!listData || listData.uid !== uid) {
      throw new Error('List not found or does not belong to the specified UID.');
    }

    // Fetch all songs
    const songResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const songData = await songResponse.json();

    // Extract song IDs from list.songIds
    const songIds = listData.songIds ? Object.keys(listData.songIds) : [];

    // Match song IDs with songData to get song details needed for display
    const songs = songIds
      .map((songId) => {
        const song = songData[songId];
        return song
          ? {
              firebaseKey: songId,
              title: song.title,
            }
          : null;
      })
      .filter((song) => song); // Remove null values for unmatched IDs (e.g., deleted songs)

    // Structure the final data for the single list
    const singleList = {
      firebaseKey,
      date: listData.date,
      congregation: listData.congregation,
      songs,
    };

    console.log('Fetched single list data:', singleList);

    return singleList;
  } catch (error) {
    console.error('Error fetching single list:', error);
    return null;
  }
};

export { getListsAndSongs, getSingleListWithSongs };
