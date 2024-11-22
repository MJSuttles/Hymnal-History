'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSingleSongWithTopic } from '../../../api/songData';

export default function ViewSong({ params }) {
  const [song, setSong] = useState(null);
  console.log(song);

  const { firebaseKey } = params;

  useEffect(() => {
    console.log('Firebase Key:', firebaseKey);
    getSingleSongWithTopic(firebaseKey).then(setSong);
  }, [firebaseKey]);

  // return (
  //   <div className="text-center my-3">
  //     <h1>Song Details</h1>
  //     <div className="my-4 song-info">
  //       <h2>{song.title}</h2>
  //       <h2>{song.hymnal}</h2>
  //       <h2>{song.pageNumber}</h2>
  //     </div>
  //   </div>
  // );

  return (
    <div className="text-center my-3">
      <h1>Song Details</h1>
      {song ? (
        <div className="my-4 song-info">
          <h2>{song.title}</h2>
          <h2>{song.hymnal}</h2>
          <h2>{song.pageNumber}</h2>
          <h2>{song.topic.topicName}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
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
