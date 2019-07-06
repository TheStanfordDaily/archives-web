import React from 'react';
import { STRINGS } from "../helpers/constants";

class NotFound extends React.Component {
  componentDidMount() {
    document.title = "Page not found" + STRINGS.SITE_NAME_WITH_DIVIDER;
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="NotFound">
        404 NOT FOUND!
      </div>
    );
  }
}

export default NotFound;
