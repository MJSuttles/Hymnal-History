import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// GET SONGS
const getSongs = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/songs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(Object.values(data));
        } else {
          resolve([]);
        }
      })
      .catch(reject);
  });

// GET SINGLE SONG
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

export { getSongs, getSingleSong };
