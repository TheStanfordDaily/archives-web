import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from './logo.svg';
import Home from './pages/Home'
import TSDNavbar from './pages/components/TSDNavbar'
import SearchView from './pages/SearchView'
import AllYearView from './pages/AllYearView'
import CalendarView from './pages/CalendarView'
import PaperView from './pages/PaperView'
import NotFound from './pages/NotFound'
import { STRINGS } from './helpers/constants'

import "./pages/sass/General.scss";
import Header from './pages/Header';

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
          <Header />
          <TSDNavbar />
          <div className="MainView">
            <Switch>
              <Route path={STRINGS.ROUTE_ROOT} exact component={Home} />
              <Route path={STRINGS.ROUTE_CALENDAR_PREFIX} strict exact component={AllYearView} />
              <Route path={STRINGS.ROUTE_CALENDAR_PREFIX + ":year(\\d{4})/:month(\\d{2})/"} strict exact component={CalendarView} />
              <Route path={STRINGS.ROUTE_PAPER_PREFIX + ":year(\\d{4})-:month(\\d{2})-:day(\\d{2})"} strict exact component={PaperView} />
              <Route path={STRINGS.ROUTE_SEARCH_PREFIX} strict exact component={SearchView}/>
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
