'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/context/authContext';
import { createList, updateList, getSongs } from '../../api/listData';

const initialFormState = {
  date: '',
  congregation: '',
  songIds: {},
  mySongs: [],
  firebaseKey: '',
};

export default function SongListForm({ obj = initialFormState }) {
  const { user } = useAuth();
  const router = useRouter();

  const [formInput, setFormInput] = useState(obj);
  const [listSongs, setListSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  useEffect(() => {
    getSongs().then(setListSongs);
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSongSelect = (e) => {
    const songId = e.target.value;
    const selectedSong = listSongs.find((song) => song.firebaseKey === songId);

    if (selectedSong && !selectedSongs.find((song) => song.firebaseKey === songId)) {
      setSelectedSongs((prevSongs) => [
        ...prevSongs,
        { ...selectedSong, index: prevSongs.length + 1 }, // Assign index
      ]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formInput,
      uid: user.uid,
      songIds: selectedSongs.reduce((acc, song) => {
        acc[song.firebaseKey] = true; // Store song Ids as key
        return acc;
      }, {}),
    };

    if (obj.firebaseKey) {
      updateList(payload).then(() => router.push('/lists'));
    } else {
      createList(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateList(patchPayload).then(() => {
          router.push('/lists');
        });
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center my-4" id="add-update-songs">
      <h1 className="my-5">{obj.firebaseKey ? 'Update ' : 'Create '}Song List Form</h1>

      <Form onSubmit={handleSubmit} className="text-center" style={{ width: '75%' }}>
        {/* DATE INPUT */}
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Date</Form.Label>
          <Form.Control type="text" placeholder="MM/DD/YYYY" name="date" value={formInput.date || ''} onChange={handleInputChange} required />
        </Form.Group>

        {/* CONGREGATION INPUT */}
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Congregation</Form.Label>
          <Form.Control type="textbox" placeholder="Name of Congregation" name="congregation" value={formInput.congregation || ''} onChange={handleInputChange} required />
        </Form.Group>

        {/* DROPDOWN SELECT MENU FOR SONGS */}
        <Form.Group className="mb-3">
          <Form.Label>Add Songs</Form.Label>
          <Form.Select onChange={handleSongSelect} aria-label="Select a Song">
            <option value="">Select a Song...</option>
            {listSongs.map((song) => (
              <option key={song.firebaseKey} value={song.firebaseKey}>
                {song.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* DISPLAY SELECTED SONGS */}
        <div>
          <h4>Selected Song</h4>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {selectedSongs.map((song) => (
              <li key={song.firebaseKey}>
                {song.index}. {song.title}
              </li>
            ))}
          </ul>
        </div>

        <button className="btn btn-primary" type="submit">
          {obj.firebaseKey ? 'Update' : 'Create'} Song List
        </button>
      </Form>
    </div>
  );
}

SongListForm.propTypes = {
  obj: PropTypes.shape({
    date: PropTypes.string,
    congregation: PropTypes.string,
    songIds: PropTypes.arrayOf(PropTypes.string),
    firebaseKey: PropTypes.string,
  }),
};
