'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListCard from '@/components/ListCard';
import { useAuth } from '@/utils/context/authContext';
import { getListsAndSongs } from '../../api/listData';

export default function Lists() {
  const [lists, setLists] = useState([]);
  const { user } = useAuth();

  const refreshListsAndSongs = () => {
    getListsAndSongs(user.uid).then(setLists);
  };

  useEffect(() => {
    refreshListsAndSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="container text-center my-4" id="songs-page">
      <h1 className="my-3" style={{ textAlign: 'center', marginLeft: '0' }}>
        Song Lists
      </h1>
      <Link href="/lists/new" passHref>
        <button type="button" className="btn btn-primary my-3">
          Add a Song List
        </button>
      </Link>

      <div className="d-flex flex-column align-items-center ps-5">
        {lists.map((list) => (
          <ListCard key={list.firebaseKey} listObj={list} onUpdate={refreshListsAndSongs} />
        ))}
      </div>
    </div>
  );
}