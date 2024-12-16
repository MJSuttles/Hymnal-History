'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import SongListForm from '../../../components/forms/SongListForm';
import { createList } from '../../../api/listData'; // Import the function to save the song list

export default function AddSongList() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter(); // Get router instance

  // Ensure that we are on the client-side before using the router
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOnSubmit = (songListData) => {
    createList(songListData)
      .then(() => {
        // Redirect to /lists after successfully creating the song list
        if (isClient) {
          router.push('/lists');
        }
      })
      .catch((error) => {
        console.error('Error creating song list:', error);
      });
  };

  return isClient ? <SongListForm onSubmit={handleOnSubmit} /> : null;
}
