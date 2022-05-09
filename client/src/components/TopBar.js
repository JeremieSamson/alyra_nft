import React, { Component } from 'react'
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import ConnectButton from "./ConnectButton";

class TopBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src="/logo.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="home">Home</Nav.Link>
                            <Nav.Link href="explore">Explore</Nav.Link>
                            <Nav.Link href="team">Team</Nav.Link>
                            <Nav.Link href="contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <ConnectButton />
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
          </>
        );
    }
}

export default TopBar;