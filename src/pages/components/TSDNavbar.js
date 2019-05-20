import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';
import { getSearchURL } from '../SearchView'
import { STRINGS } from '../../helpers/constants'

class TSDNavbar extends React.Component {
  render() {
    console.log(this.props.location);

    let navItems = { "Home": STRINGS.ROUTE_ROOT, "Calendar": STRINGS.ROUTE_CALENDAR_PREFIX, "Search": STRINGS.ROUTE_SEARCH_PREFIX };
    let navLinks = [];
    for (let navItemName in navItems) {
      let classNames = "nav-link";
      if (this.props.location.pathname === navItems[navItemName]) {
        classNames += " active";
      }
      navLinks.push(
        <Link to={navItems[navItemName]} className={classNames} key={navItems[navItemName]}>{navItemName}</Link>
      );
    }

    return (
      <Navbar expand="md" variant="dark" className="navbar">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="w-100 order-1 order-md-0 dual-collapse2">
          <Nav className="mr-auto">
            {navLinks}
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
          {this.props.location.pathname !== "/" && <Form inline className="ml-auto" onSubmit={(e) => this.sendSearch(e)}>
            <FormControl type="text" placeholder="Search&hellip;" className="mr-sm-2 searchbar" name="searchKeyword" />
          </Form>}
        </Navbar.Collapse>
      </Navbar>
    );
  }

  sendSearch(event) {
    const searchKeyword = event.target.elements.searchKeyword.value;
    if (searchKeyword) {
      this.props.history.push(getSearchURL({ keyword: searchKeyword }));
    }
    event.preventDefault();
  }
}

export default withRouter(TSDNavbar);
