import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { deleteSongList } from '../api/listData';

export default function ListCard({ listObj, onUpdate }) {
  // Function to map song details and display them as a list
  const listOfSongs = () => {
    if (!listObj.songs || listObj.songs.length === 0) {
      return <p>No songs available</p>;
    }

    return (
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {listObj.songs.map((song) => (
          <li key={song.firebaseKey}>{song.title}</li>
        ))}
      </ul>
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${listObj.date}?`)) {
      console.warn('Delete event triggered!');
      deleteSongList(listObj.firebaseKey).then(() => {
        onUpdate();
      });
    }
  };

  return (
    <div className="card border my-3" style={{ width: '100%', height: 'auto' }}>
      <div className="card-body d-flex align-items-center">
        <div className="col">
          <p>{listObj.date}</p>
        </div>
        <div className="col">
          <p>{listObj.congregation}</p>
        </div>
        <div className="col">
          {/* Render the list of songs */}
          {listOfSongs()}
        </div>
        <div className="col">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="div">
                <Link href={`/lists/${listObj.firebaseKey}`} passHref>
                  Go to Song List
                </Link>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete Song List</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

ListCard.propTypes = {
  listObj: PropTypes.shape({
    date: PropTypes.string.isRequired,
    congregation: PropTypes.string.isRequired,
    firebaseKey: PropTypes.string.isRequired,
    songs: PropTypes.arrayOf(
      PropTypes.shape({
        firebaseKey: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
