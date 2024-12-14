'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { getSingleListWithSongs, deleteSongList } from '../../../api/listData';
import { useAuth } from '../../../utils/context/authContext';
import SongListForm from '../../../components/forms/SongListForm';

export default function ViewList({ params }) {
  const [list, setList] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseKey } = params || {}; // Destructure params safely
  const { user } = useAuth();

  const refreshLists = async () => {
    try {
      const fetchedList = await getSingleListWithSongs(user.uid, firebaseKey);
      setList(fetchedList || { songs: [] });
    } catch (error) {
      console.error('Error fetching the list:', error);
      setList(null);
    }
  };

  useEffect(() => {
    // Call refreshLists only if firebaseKey exists (i.e., not on `/lists/new`)
    if (firebaseKey) {
      refreshLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseKey, user]);

  // Handle the special case for `/lists/new` route
  if (pathname === '/lists/new') {
    return <SongListForm />;
  }

  const handleDelete = () => {
    if (!list || !list.firebaseKey) {
      console.error('No list or firebaseKey available to delete.');
      return;
    }

    if (window.confirm(`Delete song list "${list.date}"?`)) {
      deleteSongList(list.firebaseKey).then(() => {
        console.log(`Song list was deleted.`);
        router.push(`/lists`); // Redirect to the lists page
      });
    }
  };

  return (
    <div className="text-center my-3">
      <h1>Song List Details</h1>
      {list ? (
        <div className="my-4 song-info">
          <p>
            Date: <strong>{list.date}</strong>
          </p>
          <p>
            Congregation: <strong>{list.congregation}</strong>
          </p>
          <p>Songs:</p>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {list.songs.map((song) => (
              <li key={song.firebaseKey}>
                <strong>{song.title}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Song List has been deleted or is unavailable.</p>
      )}

      <svg onClick={handleDelete} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
      </svg>

      <hr className="my-4" />
    </div>
  );
}

ViewList.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string,
  }).isRequired,
};
