import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import Div100vh from "react-div-100vh";
import HomeView from "./pages/HomeView";
import Header from "./pages/Header";
import TSDNavbar from "./pages/components/TSDNavbar";
import SearchView from "./pages/SearchView";
import AllYearView from "./pages/AllYearView";
import CalendarView from "./pages/CalendarView";
import PaperView from "./pages/PaperView";
import AcknowledgementsView from "./pages/AcknowledgementsView";
import NotFound from "./pages/NotFound";
import { STRINGS } from "./helpers/constants";

import "./pages/sass/General.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    ReactGA.initialize(STRINGS.GOOGLE_ANALYTICS_TRACKING_ID);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const yearRoute = STRINGS.ROUTE_ROOT + ":year(\\d{4})/";
    const monthRoute = yearRoute + ":month(\\d{2})/";
    const dayRoute = monthRoute + ":day(\\d{2})";
    // https://stackoverflow.com/a/42181069/2603230
    return (
      <Router>
        <Div100vh className="App">
          <Header />
          <TSDNavbar />
          <div className="MainView">
            <Switch>
              <Route path={STRINGS.ROUTE_ROOT} exact component={HomeView} />
              <Route
                path={STRINGS.ROUTE_CALENDAR}
                strict
                exact
                component={AllYearView}
              />
              <Route path={monthRoute} strict exact component={CalendarView} />
              <Route path={dayRoute} strict exact component={PaperView} />
              <Route
                path={STRINGS.ROUTE_SEARCH_PREFIX}
                strict
                exact
                component={SearchView}
              />
              <Route
                path={STRINGS.ROUTE_ACKNOWLEDGEMENTS}
                strict
                exact
                component={AcknowledgementsView}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Div100vh>
      </Router>
    );
  }
}

export default App;
