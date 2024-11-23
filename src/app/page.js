'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SongCard from '../components/SongCard';
import { getSongsAndTopics } from '../api/songData';

function Home() {
  const [songs, setSongs] = useState([]);

  // useEffect(() => {
  //   getSongsAndTopics().then(setSongs);
  // }, []);

  useEffect(() => {
    getSongsAndTopics().then((data) => {
      console.log(data);
      setSongs(data);
    });
  }, []);

  return (
    <div className="container text-center my-4" id="songs-page">
      <h1 className="my-3" style={{ textAlign: 'center', marginLeft: '0' }}>
        Home
      </h1>
      <Link href="/songs/new" passHref>
        <button type="button" className="btn btn-primary my-3">
          Add a Song
        </button>
      </Link>

      <div className="d-flex flex-column align-items-center ps-5">
        {songs.map((song) => (
          <SongCard key={song.firebaseKey} songObj={song} />
        ))}
      </div>
    </div>
  );
}

export default Home;
