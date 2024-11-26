'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SongForm from '@/components/forms/SongForm';
import { getSingleSongWithTopic } from '@/api/songData';

export default function EditSong({ params }) {
  const { uid } = params;
  const [formInput, setFormInput] = useState({});

  useEffect(() => {
    getSingleSongWithTopic(uid).then(setFormInput);
  }, [uid]);

  return (
    <div>
      <SongForm obj={formInput} />
    </div>
  );
}

EditSong.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
