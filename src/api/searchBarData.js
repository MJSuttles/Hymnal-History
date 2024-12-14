import { getSongsAndTopics } from './songData';
import { getListsAndSongs } from './listData';

const getSearchData = async (userId) => {
  const [songs, lists] = await Promise.all([getSongsAndTopics(userId), getListsAndSongs(userId)]);

  return {
    songs: songs.map((song) => ({ ...song, type: 'song' })),
    lists: lists.map((list) => ({ ...list, type: 'list' })),
  };
};

export default getSearchData;
