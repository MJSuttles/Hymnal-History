'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SongForm from '@/components/forms/SongForm';
import { getSingleSongWithTopic } from '@/api/songData';

export default function EditSong({ params }) {
  // const { songId } = params.firebaseKey;
  const { firebaseKey: songId } = params; // Rename firebaseKey to songId
  console.log('This is the songId', songId);
  console.log(songId);
  const [formInput, setFormInput] = useState({});

  useEffect(() => {
    getSingleSongWithTopic(songId).then(setFormInput);
  }, [songId]);

  return (
    <div>
      <SongForm obj={formInput} />
    </div>
  );
}

EditSong.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
