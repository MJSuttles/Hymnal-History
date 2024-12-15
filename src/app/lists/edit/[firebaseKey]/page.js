'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../utils/context/authContext';
import { getSingleListWithSongs, updateList } from '../../../../api/listData';
import SongListForm from '../../../../components/forms/SongListForm';

export default function EditSongListPage({ params }) {
  const [list, setList] = useState(null);
  const { user } = useAuth();
  const { firebaseKey } = params;
  const router = useRouter();

  // Fetch the song list data
  const refreshList = async () => {
    try {
      const fetchedList = await getSingleListWithSongs(user.uid, firebaseKey);
      setList(fetchedList);
    } catch (error) {
      console.error('Error fetching the list:', error);
    }
  };

  useEffect(() => {
    if (firebaseKey) {
      refreshList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseKey, user]);

  // Handle form submission
  const handleUpdate = async (formData) => {
    const payload = {
      ...formData,
      uid: user.uid,
    };
    try {
      await updateList(payload);
      router.push(`/lists/${firebaseKey}`); // Redirect to the list detail page after successful update
    } catch (error) {
      console.error('Error updating the list:', error);
    }
  };

  if (!list) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center my-3">
      <h1>Edit Song List</h1>
      <SongListForm obj={list} onSubmit={handleUpdate} />
    </div>
  );
}

// Corrected propTypes validation
EditSongListPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
