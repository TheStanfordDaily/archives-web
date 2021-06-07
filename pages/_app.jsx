
import './index.scss';
import "../components/sass/General.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "rc-pagination/assets/index.css";


import Head from "next/head";
import Div100vh from "react-div-100vh";
import Header from "../components/Header";
import React from "react";
import ReactGA from "react-ga";
import { STRINGS } from "../helpers/constants";
import TSDNavbar from "../components/components/TSDNavbar";


// Workaround to fix production builds, see https://github.com/vercel/next.js/issues/15883
// We define document and window here so that the production build still
// works, because openseadragon requires that certain properties are not undefined.
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({}),
    documentElement: {},
    querySelector: function () {}
  };
  global.window = {
    addEventListener: () => null,
    removeEventListener: () => null,
    location: {
      search: ""
    }
  };
  global.navigator = {
  };
}


  /*
   * Wrapper for all pages.
   */
  class App extends React.Component {
    constructor(props) {
      super(props);
      ReactGA.initialize(STRINGS.GOOGLE_ANALYTICS_TRACKING_ID);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
      const { Component, pageProps } = this.props;
      return (
        <Div100vh className="App">
          <Head>
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossOrigin="anonymous"
            />
            <title>The Stanford Daily Archives</title>
          </Head>
          <Header />
          <TSDNavbar />
          <div className="MainView">
            <Component {...pageProps} />
          </div>
        </Div100vh>
      );
    }
  }


export default App;
