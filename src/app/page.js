'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/utils/context/authContext';
import SongCard from '../components/SongCard';
import { getSongsAndTopics } from '../api/songData';
import SearchBar from '../components/SearchBar';

function Home() {
  const [songs, setSongs] = useState([]);
  const { user } = useAuth();

  const refreshSongsAndTopics = () => {
    getSongsAndTopics(user.uid).then(setSongs);
  };

  useEffect(() => {
    refreshSongsAndTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="container text-center my-4" id="songs-page">
      <h1 className="my-3" style={{ textAlign: 'center', marginLeft: '0' }}>
        Home
      </h1>
      <SearchBar />
      <Link href="/songs/new" passHref>
        <button type="button" className="btn btn-primary my-3">
          Add a Song
        </button>
      </Link>

      <div className="d-flex flex-column align-items-center ps-5">
        {songs.map((song) => (
          <SongCard key={song.firebaseKey} songObj={song} onUpdate={refreshSongsAndTopics} />
        ))}
      </div>
    </div>
  );
}

export default Home;
