import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';
import { STRINGS } from '../../helpers/constants'

class TSDNavbar extends React.Component {
  render() {
    return (
      <Navbar expand="md" variant="dark" className="navbar">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="w-100 order-1 order-md-0 dual-collapse2">
          <Nav className="mr-auto">
            <Nav.Link href="/calendar">Home</Nav.Link>
            <Nav.Link href="/link" className="active">Link</Nav.Link>
            <Nav.Link href={STRINGS.ROUTE_SEARCH_PREFIX}>Search</Nav.Link>
            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>*/}
          </Nav>
        </Navbar.Collapse>
        <div className="mx-auto order-0">
          <Navbar.Brand className="mx-auto site-title"><Link to={STRINGS.ROUTE_ROOT}>{/* TODO: use TSD logo */}The Stanford Daily Archive</Link></Navbar.Brand>
        </div>
        <Navbar.Collapse className="justify-content-end w-100 order-3 dual-collapse2">
          <Form inline className="ml-auto">
            <FormControl type="text" placeholder="Search&hellip;" className="mr-sm-2 searchbar" />
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(TSDNavbar);
