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
    const songs = songsData ? Object.values(songsData) : [];

    // Fetch topics
    const topicsResponse = await fetch(`${endpoint}/topics.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const topicsData = await topicsResponse.json();
    const topics = topicsData ? Object.values(topicsData) : [];

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

const getSingleSong = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/songs/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export { getSongsAndTopics, getSingleSong };
