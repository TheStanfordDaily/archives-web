import React from "react";
import { withRouter } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { sendSearchFromForm } from "../SearchView";

class SearchWidget extends React.Component {
  render() {
    return (
      <form
        className="mt-4"
        onSubmit={e => sendSearchFromForm(e, this.props.history)}
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            name="searchKeyword"
            placeholder="Search&hellip;"
            required
          />
          <div className="input-group-append">
            <button type="submit" className="form-control HomeSearchButton">
              <IoIosSearch />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(SearchWidget);
