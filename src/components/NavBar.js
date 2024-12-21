/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>
            {/* eslint-disable @next/next/no-img-element */}
            <img src="/../images/hymnal-hero-icon250.png" alt="Hymnal Hero Icon" width={50} height={50} style={{ marginLeft: '10px' }} />
            {/* eslint-disable @next/next/no-img-element */}
            <img src="/../images/hymnal-hero-name-only2.png" alt="Hymnal Hero Name" width={100} height={38.44} style={{ marginLeft: '20px' }} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link className="nav-link" href="/">
              Songs
            </Link>
            <Link className="nav-link" href="/songs/new">
              Add a Song
            </Link>
            <Link className="nav-link" href="/lists">
              Song Lists
            </Link>
            <Link className="nav-link" href="/lists/new">
              Add a Song List
            </Link>
          </Nav>

          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
