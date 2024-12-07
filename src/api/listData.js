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
        .filter((song) => song); // Remove null values for unmatched IDs

      return {
        // Display 'date', 'congregation', and 'songs' (title of each song in each list) on Bootstrap cards
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

// const getSingleListWithSongs = (firebaseKey) =>
//   new Promise((resolve, reject) => {
//     fetch(`${endpoint}/lists/${firebaseKey}.json`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then((listData) => {
//         if (!listData.songIds || listData.songIds.length === 0) {
//           // Resolve immediately if no songIds
//           resolve({ list: listData, songs: [] });
//           return;
//         }

//         // Fetch all songs using their IDs in parallel
//         const songFetchPromises = listData.songIds.map(
//           (songId) =>
//             fetch(`${endpoint}/songs/${songIds}.json`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//             })
//               .then((response) => {
//                 if (response.ok) return response.json();
//                 // Return null if the song is not found (e.g., deleted)
//                 return null;
//               })
//               .catch(() => null), // Return null if there's an error fetching the song
//         );

//         // Wait for all fetches to complete
//         Promise.all(songFetchPromises)
//           .then((song) => {
//             // Map songIds to fetched songs to maintain order, filtering out null values
//             const orderedSongs = listData.songIds.map((songId) => songs.find((song) => song?.firebaseKey === song)).filter((song) => song); // Remove null or undefined songs

//             resolve({ ...listData, songs: orderedSongs });
//           })
//           .catch(reject); // Handle errors in fetching songs
//       })
//       .catch(reject); // Handle errors in fetching the list
//   });

export default getListsAndSongs;
