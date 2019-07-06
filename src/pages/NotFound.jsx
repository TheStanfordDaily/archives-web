import React from "react";
import SearchWidget from "./components/SearchWidget";
import { STRINGS } from "../helpers/constants";

class NotFound extends React.Component {
  componentDidMount() {
    document.title = "Page Not Found" + STRINGS.SITE_NAME_WITH_DIVIDER;
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="NotFound">
        <h1>Page Not Found</h1>
        <p>
          We’re sorry! It looks like nothing was found at this location. Maybe
          try searching for it?
        </p>
        <SearchWidget />
      </div>
    );
  }
}

export default NotFound;
