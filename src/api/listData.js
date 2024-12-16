import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// GET ALL LISTS AND SONGS
const getListsAndSongs = async (uid) => {
  try {
    // Fetch all lists
    const listsResponse = await fetch(`${endpoint}/lists.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const listsData = await listsResponse.json();

    // Fetch all songs
    const songsResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let songsData = await songsResponse.json();

    // Safeguard: If data is null, set to empty objects
    if (!listsData) return [];
    if (!songsData) songsData = {};

    // Filter lists belonging to the user
    const userLists = Object.keys(listsData)
      .filter((key) => listsData[key]?.uid === uid) // Check for existence of listsData[key]
      .map((key) => {
        const list = listsData[key];

        // Get the songs associated with this list
        const songIds = list.songIds ? Object.keys(list.songIds) : [];
        const songs = songIds
          .map((songId) => ({
            firebaseKey: songId,
            ...songsData[songId],
          }))
          .filter((song) => song?.firebaseKey); // Ensure song exists

        return {
          firebaseKey: key,
          ...list,
          songs, // Include the songs in the list object
        };
      });

    return userLists;
  } catch (error) {
    console.error('Error fetching lists and songs:', error);
    return [];
  }
};

// GET SINGLE LIST WITH SONGS
const getSingleListWithSongs = async (uid, firebaseKey) => {
  try {
    const listResponse = await fetch(`${endpoint}/lists/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const listData = await listResponse.json();

    if (!listData || listData.uid !== uid) {
      throw new Error('List not found or does not belong to the specified UID.');
    }

    const songResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let songData = await songResponse.json();
    if (!songData) songData = {}; // Default to empty object

    const songIds = listData.songIds ? Object.keys(listData.songIds) : [];

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
      .filter((song) => song);

    return {
      firebaseKey,
      date: listData.date,
      congregation: listData.congregation,
      songs,
    };
  } catch (error) {
    console.error('Error fetching single list:', error);
    return null;
  }
};

// DELETE SONG LIST
const deleteSongList = (firebaseKey) =>
  new Promise((resolve, reject) => {
    if (!firebaseKey) {
      console.error('Invalid firebaseKey:', firebaseKey); // Log the invalid key for debugging
      reject(new Error('Invalid firebaseKey. Cannot delete song list.'));
      return; // Exit early
    }

    fetch(`${endpoint}/lists/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete song list: ${response.status}`);
        }
        resolve(firebaseKey);
      })
      .catch(reject);
  });

// CREATE LIST
const createList = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/lists.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// UPDATE LIST
const updateList = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/lists/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// GET SONGS FOR LIST
const getSongs = async () => {
  const response = await fetch(`${endpoint}/songs.json`);
  const data = await response.json();

  // Transform Firebase's key-value pair structure into an array
  return data ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key })) : [];
};

export { getListsAndSongs, getSingleListWithSongs, deleteSongList, createList, updateList, getSongs };
