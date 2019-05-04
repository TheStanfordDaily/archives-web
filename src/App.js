import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home'
import PaperView from './pages/PaperView'

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
          <Route path="/" exact component={Home} />
          <Route path="/:year(\d{4})-:month(\d{2})-:day(\d{2})" exact component={PaperView} />
        </div>
      </Router>
    );
  }
}

export default App;
