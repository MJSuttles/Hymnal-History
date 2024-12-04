'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListCard from '@/components/ListCard';
import { getListsAndSongs } from '../../api/listData';
// import ListCardsContainer from '@/components/ListCardsContainer';

export default function Lists() {
  const [lists, setLists] = useState([]);

  const refreshListsAndSongs = () => {
    getListsAndSongs().then(setLists);
  };

  useEffect(() => {
    refreshListsAndSongs();
  }, []);

  return (
    <div className="container text-center my-4" id="songs-page">
      <h1 className="my-3" style={{ textAlign: 'center', marginLeft: '0' }}>
        Home
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
