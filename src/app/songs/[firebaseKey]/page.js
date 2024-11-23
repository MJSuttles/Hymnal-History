'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { getSingleSongWithTopic, deleteSong } from '../../../api/songData';

export default function ViewSong({ params }) {
  const [song, setSong] = useState(null);
  console.log(song);
  const router = useRouter();

  const { firebaseKey } = params;

  const refreshSongs = () => {
    getSingleSongWithTopic(firebaseKey).then(setSong);
  };

  useEffect(() => {
    refreshSongs();
  }, [firebaseKey]);

  // const handleDelete = () => {
  //   if (window.confirm(`Delete song ${firebaseKey}?`)) {
  //     deleteSong(firebaseKey).then(() => {
  //       console.log(`Song ${firebaseKey} was deleted.`);
  //       refreshSongs();
  //     });
  //   }
  // };

  const handleDelete = () => {
    if (!song) return;

    if (window.confirm(`Delete song "${song.title}"?`)) {
      deleteSong(song.firebaseKey).then(() => {
        console.log(`Song "${song.title}" was deleted.`);
        router.push('/'); // Redirect to the songs list page
      });
    }
  };

  return (
    <div className="text-center my-3">
      <h1>Song Details</h1>
      {song ? (
        <div className="my-4 song-info">
          <h2>{song.title}</h2>
          <h2>{song.hymnal}</h2>
          <h2>{song.pageNumber}</h2>
          <h2>{song.topic?.topicName}</h2>
        </div>
      ) : (
        <p>Song has been deleted or is unavailable.</p>
      )}

      <svg onClick={() => handleDelete(song.firebaseKey)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
      </svg>

      <hr className="my-4" />
    </div>
  );
}

// ViewSong.propTypes = {
//   params: PropTypes.objectOf({}).isRequired,
// };

ViewSong.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired, // Update this
  }).isRequired,
};
