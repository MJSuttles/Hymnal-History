import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function ListCard({ listObj }) {
  return (
    <div className="card border my-3" style={{ width: '100%', height: '7rem' }}>
      <div className="card-body d-flex align-items-center">
        <div className="col">
          <p>{listObj.date}</p>
        </div>
        <div className="col">
          <p>{listObj.congregation}</p>
        </div>
        <div className="col">
          <p>{listObj.songIds ? listObj.songIds.join(', ') : 'No songs'}</p>
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
    songIds: PropTypes.arrayOf(PropTypes.string),
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
