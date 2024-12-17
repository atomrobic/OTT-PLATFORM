import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHistory, faClock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './navbar.css'; // Ensure this is included for styling
import greenShape from "../assets/image.png"; // Adjust path if necessary

const Navbars = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary sticky">
      <Container>
        <Navbar.Brand as={Link} to="/Movieshowlist" className="navbar-logo">
          <img className='logo'
            src={greenShape} 
            style={{ width: '45px', height: '50px'}} // Adjust image size as needed
          />
          <span>
            MOVIE ZONE
          </span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Movieshowlist">
              <FontAwesomeIcon icon={faHome} /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/WatchHistory">
              <FontAwesomeIcon icon={faHistory} /> Watch History
            </Nav.Link>
            <Nav.Link as={Link} to="/watchLater">
              <FontAwesomeIcon icon={faClock} /> Watch Later
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/more">
              Setting
            </Nav.Link>
            <Nav.Link as={Link} to="/LoginForm">
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbars;
