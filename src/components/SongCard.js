'use client';

import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function SongCard({ songObj }) {
  return (
    <div className="row align-items-center border my-3 d-flex container" style={{ width: '70%', height: '7rem' }}>
      <div className="col">
        <p>{songObj.title}</p>
      </div>
      <div className="col">
        <p>{songObj.hymnal}</p>
      </div>
      <div className="col">
        <p>{songObj.pageNumber}</p>
      </div>
      <div className="col">
        <p>{songObj.topic ? songObj.topic.topicName : 'No Topic'}</p>
      </div>
      <div className="col">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic" />

          <Dropdown.Menu>
            <Dropdown.Item href="">
              <Link href={`/songs/${songObj.firebaseKey}`} passHref>
                Go to Song
              </Link>
            </Dropdown.Item>
            {/* <Dropdown.Item>
              <Link href={`/songs/edit/${songObj.firebaseKey}`} passHref>
                Edit Song
              </Link>
            </Dropdown.Item> */}
            {/* <Dropdown.Item>
              ENTER DELETE DETAILS
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

SongCard.propTypes = {
  songObj: PropTypes.shape({
    title: PropTypes.string.isRequired,
    hymnal: PropTypes.string.isRequired,
    pageNumber: PropTypes.number.isRequired,
    firebaseKey: PropTypes.string.isRequired,
    topic: PropTypes.shape({
      firebaseKey: PropTypes.string,
      topicName: PropTypes.string,
    }),
  }).isRequired,
};
