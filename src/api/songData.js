import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getSongsAndTopics = async (uid) => {
  try {
    // Fetch songs
    const songsResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const songsData = await songsResponse.json();

    const songs = songsData
      ? Object.entries(songsData)
          .map(([key, value]) => ({
            ...value,
            firebaseKey: key, // Add firebaseKey to each song
          }))
          .filter((song) => song && song.uid === uid && typeof song.topicId !== 'undefined')
      : [];

    // Fetch topics
    const topicsResponse = await fetch(`${endpoint}/topics.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const topicsData = await topicsResponse.json();

    const topics = topicsData
      ? Object.entries(topicsData)
          .map(([key, value]) => ({
            ...value,
            firebaseKey: key, // Add firebaseKey to each topic
          }))
          .filter((topic) => topic) // Filter invalid topics
      : [];

    // Create a lookup map for topics by firebaseKey
    const topicMap = topics.reduce((map, topic) => {
      // eslint-disable-next-line no-param-reassign
      map[topic.firebaseKey] = topic;
      return map;
    }, {});

    // Combine songs with their corresponding topic information
    const combinedData = songs.map((song) => ({
      ...song,
      topic: song.topicId ? topicMap[song.topicId] || null : null, // Ensure topicId exists
    }));

    return combinedData; // Returns an array of songs with topic info included
  } catch (error) {
    console.error('Error fetching songs or topics:', error);
    throw error;
  }
};

// GET SINGLE SONG WITH TOPIC
const getSingleSongWithTopic = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/songs/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((songData) => {
        if (!songData.topicId) {
          // Resolve immediately if no topicId
          resolve({ song: songData, topic: null });
        } else {
          // Fetch the topic using topicId
          fetch(`${endpoint}/topics/${songData.topicId}.json`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((topicData) => {
              // Merge the topic data into the song object
              // eslint-disable-next-line no-param-reassign
              songData.topic = topicData;
              resolve(songData);
            })
            .catch(reject); // Catch errors in the second fetch
        }
      })
      .catch(reject); // Catch errors in the first fetch
  });

// DELETE SONG
const deleteSong = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/songs/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete song: ${response.status}`);
        }
        resolve(firebaseKey);
      })
      .catch(reject);
  });

// CREATE SONG
const createSong = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/songs.json`, {
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

const updateSong = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/songs/${payload.firebaseKey}.json`, {
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

// const getTopics = () =>
//   new Promise((resolve, reject) => {
//     fetch(`${endpoint}/topics.json`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => resolve(data))
//       .catch(reject);
//   });

const getTopics = async () => {
  const response = await fetch(`${endpoint}/topics.json`);
  const data = await response.json();

  // Transform Firebase's key-value pair structure into an array
  return data ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key })) : [];
};

export { getSongsAndTopics, getSingleSongWithTopic, deleteSong, createSong, updateSong, getTopics };
