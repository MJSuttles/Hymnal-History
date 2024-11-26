'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/context/authContext';
import { createSong, updateSong, getSongsAndTopics } from '@/api/songData';

const initialFormState = {
  title: '',
  hymnal: '',
  pageNumber: '',
  topicId: '',
};

export default function SongForm({ obj = initialFormState }) {
  const { user } = useAuth();
  const router = useRouter();

  const [formInput, setFormInput] = useState(obj);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    getSongsAndTopics().then(setSongs);
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateSong(formInput).then(() => router.push(`songs/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createSong(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateSong(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center my-4" id="add-update-songs">
      <h1 className="my-5">Song Form</h1>

      <Form onSubmit={handleSubmit} className="text-center" style={{ width: '75%' }}>
        {/* TITLE INPUT */}
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Title</Form.Label>
          <Form.Control type="textbox" placeholder="title of song" name="title" value={formInput.title || ''} onChange={handleChange} required />
          <Form.Text className="text-muted">required</Form.Text>
        </Form.Group>

        {/* HYMNAL INPUT */}
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Hymnal</Form.Label>
          <Form.Control type="textbox" placeholder="title of hymnal" name="hymnal" value={formInput.hymnal || ''} onChange={handleChange} required />
          <Form.Text className="text-muted">required</Form.Text>
        </Form.Group>

        {/* PAGE NUMBER INPUT */}
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Page Number</Form.Label>
          <Form.Control type="textbox" placeholder="Enter page number" name="pageNumber" value={formInput.pageNumber || ''} onChange={handleChange} required />
          <Form.Text className="text-muted">required</Form.Text>
        </Form.Group>

        {/* DROPDOWN SELECT MENU FOR TOPICS */}
        <Form.Group className="mb-3">
          <Form.Label>Topic</Form.Label>
          <Form.Select onChange={handleChange} aria-label="Topic" name="topicId" className="mb-3" value={formInput.topicId || ''} required>
            <option value="">Select ...</option>
            {/* Map over values. Remember to add a key prop. */}
            {songs.map((song) => (
              <option key={song.topicId} value={song.topicId}>
                {song.topicId}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <button className="btn btn-primary" type="submit">
          {obj.firebaseKey ? 'Update' : 'Create'} playlist
        </button>
      </Form>
    </div>
  );
}

SongForm.propTypes = {
  obj: PropTypes.shape({
    title: PropTypes.string,
    hymnal: PropTypes.string,
    pageNumber: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
};
