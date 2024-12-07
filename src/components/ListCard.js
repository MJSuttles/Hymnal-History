import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function ListCard({ listObj }) {
  // Method for mapping song details to be displayed as array on each Bootstrap card
  const listOfSongs = () => {
    const songItems = [];
    /* eslint-disable no-restricted-syntax */
    for (const song of listObj.songs) {
      songItems.push(<li key={song.id}>{song.title}</li>);
    }
    return <ul>{songItems}</ul>;
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
          {/* Call on listOfSongs method above so individual song details can be displayed on cards */}
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
              <Dropdown.Item as="div">
                <Link href={`/lists/edit/${listObj.firebaseKey}`} passHref>
                  Edit Song List
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>Delete Song List</Dropdown.Item>
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
    ).isRequired,
  }).isRequired,
};
