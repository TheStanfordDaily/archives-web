import Link from "next/link";
import { Nav, Navbar } from "react-bootstrap";
import { withRouter } from 'next/router';
import React from "react";
import ReactGA from "react-ga";
import { STRINGS } from "../../helpers/constants";

class TSDNavbar extends React.Component {
  componentDidMount() {
    this.onRouteChanged();
  }

  componentDidUpdate(prevProps) {
    if (this.props.router !== prevProps.router) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    let navItems = {
      left: {
        Home: STRINGS.ROUTE_ROOT,
        Calendar: STRINGS.ROUTE_CALENDAR,
        Acknowledgements: STRINGS.ROUTE_ACKNOWLEDGEMENTS
      },
      right: {
        Search: STRINGS.ROUTE_CLOUDSEARCH_PREFIX
      }
    };
    let navLinks = {};
    for (let navType in navItems) {
      navLinks[navType] = [];
      for (let navItemName in navItems[navType]) {
        const navItemPathname = navItems[navType][navItemName];
        let classNames = "nav-link";
        if (this.props.router.pathname === navItemPathname) {
          classNames += " active";
        }
        navLinks[navType].push(
          <Link
            href={navItemPathname}
            key={navItemPathname}
          >
            <a className={classNames}>{navItemName}</a>
          </Link>
        );
      }
    }

    return (
      <Navbar expand="md" variant="dark" className="navbar">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="w-100 order-1 order-md-0 dual-collapse2"
        >
          <Nav className="mr-auto">{navLinks.left}</Nav>
        </Navbar.Collapse>
        <div className="mx-auto order-0">
          <Navbar.Brand className="mx-auto site-title">
            <Link href={STRINGS.ROUTE_ROOT}>
              <a>{/* TODO: use TSD logo */ STRINGS.SITE_NAME}</a>
            </Link>
          </Navbar.Brand>
        </div>
        <Navbar.Collapse className="justify-content-end w-100 order-3 dual-collapse2">
          <Nav className="ml-auto">{navLinks.right}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(TSDNavbar);
