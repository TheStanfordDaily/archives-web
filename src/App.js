import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home'
import CalendarView from './pages/CalendarView'
import PaperView from './pages/PaperView'
import NotFound from './pages/NotFound'

class App extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about/">About</Link>
              </li>
              <li>
                <Link to="/users/">Users</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/calendar/:year(\d{4})(/)?:month(\d{2})?" exact component={CalendarView} />
            <Route path="/paper/:year(\d{4})-:month(\d{2})-:day(\d{2})" exact component={PaperView} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
