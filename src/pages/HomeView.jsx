import React from "react";
import SearchWidget from "./components/SearchWidget";
import { STRINGS } from "../helpers/constants";

class HomeView extends React.Component {
  componentDidMount() {
    document.title = STRINGS.SITE_NAME;
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="HomeMainView container mt-4 text-left">
        <div className="row">
          <div className="HomeSection">
            <h2>About this collection</h2>
            <p>
              Welcome to The Stanford Daily archives! We are proud to present
              the collection of issues dating back to 1892. Since its founding,
              the Daily has informed, educated and entertained Stanford students
              and the surrounding community.
            </p>
            <p>
              Providing a firsthand account of life at Stanford from 1892-today,
              the archives is an invaluable resource for anyone looking to
              explore American history as seen through the eyes of
              undergraduates. Issues are presented as originally printed,
              accompanied by a sidebar featuring articles in plain text. The
              collection is entirely searchable, and registration is only
              necessary to make corrections in the plain text.
            </p>
            <p>
              This collection contains 18,931 issues comprising 143,685 pages
              and 1,013,592 articles.
            </p>
          </div>
          <div className="HomeSection ">
            <h2>Search the collection</h2>
            <SearchWidget />
          </div>
          <div className="HomeSection ">
            <h2>Subscribe</h2>
            Visit{" "}
            <a
              href="https://www.stanforddaily.com/email-digests/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.stanforddaily.com/email-digests/
            </a>{" "}
            to receive top Stanford headlines in your inbox every morning. Our
            team of dedicated student journalists forms the hub of
            Stanford-related news, sports and arts content, and serves as the
            voice of the student body.
          </div>
        </div>
      </div>
    );
  }
}

export default HomeView;
