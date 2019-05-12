import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home'
import CalendarView from './pages/CalendarView'
import PaperView from './pages/PaperView'
import NotFound from './pages/NotFound'
import { STRINGS } from './helpers/constants'

import "./pages/css/General.css"

class App extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    // https://stackoverflow.com/a/42181069/2603230
    return (
      <Router>
        <div className="App">
          <Navbar expand="md" variant="dark" className="navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="w-100 order-1 order-md-0 dual-collapse2">
              <Nav className="mr-auto">
                <Nav.Link href="/calendar">Home</Nav.Link>
                <Nav.Link href="#link" className="active">Link</Nav.Link>
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
          <div className="MainView">
            <Switch>
              <Route path={STRINGS.ROUTE_ROOT} exact component={Home} />
              <Route path={STRINGS.ROUTE_CALENDAR_PREFIX + ":year(\\d{4})/:month(\\d{2})/"} strict exact component={CalendarView} />
              <Route path={STRINGS.ROUTE_PAPER_PREFIX + ":year(\\d{4})-:month(\\d{2})-:day(\\d{2})"} strict exact component={PaperView} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
