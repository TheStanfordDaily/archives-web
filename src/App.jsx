import "./pages/sass/General.scss";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import AcknowledgementsView from "./pages/AcknowledgementsView";
import AllYearView from "./pages/AllYearView";
import CalendarView from "./pages/CalendarView";
import CloudsearchView from "./pages/CloudsearchView";
import Div100vh from "react-div-100vh";
import Header from "./pages/Header";
import HomeView from "./pages/HomeView";
import NotFound from "./pages/NotFound";
import PaperView from "./pages/PaperView";
import React from "react";
import ReactGA from "react-ga";
import { STRINGS } from "./helpers/constants";
import TSDNavbar from "./pages/components/TSDNavbar";

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
                path={STRINGS.ROUTE_CLOUDSEARCH_PREFIX}
                strict
                exact
                component={CloudsearchView}
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
