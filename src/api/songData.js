import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getSongsAndTopics = async () => {
  try {
    // Fetch songs
    const songsResponse = await fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const songsData = await songsResponse.json();

    const songs = songsData
      ? Object.entries(songsData).map(([key, value]) => ({
          ...value,
          firebaseKey: key, // Add firebaseKey to each song
        }))
      : [];

    // Fetch topics
    const topicsResponse = await fetch(`${endpoint}/topics.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const topicsData = await topicsResponse.json();
    // const topics = topicsData ? Object.values(topicsData) : [];
    const topics = topicsData
      ? Object.entries(topicsData).map(([key, value]) => ({
          ...value,
          firebaseKey: key, // Add firebaseKey to each topic
        }))
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
      topic: topicMap[song.topicId] || null, // Add topic info or null if not found
    }));

    return combinedData; // Returns an array of songs with topic info included
  } catch (error) {
    console.error('Error fetching songs or topics:', error);
    throw error;
  }
};

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

export { getSongsAndTopics, getSingleSongWithTopic, deleteSong };
