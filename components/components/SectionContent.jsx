import { INTERNAL, STRINGS, getDateTitle } from "../../helpers/constants";

import Link from "next/link";
import Loading from "./Loading";
import React from "react";
import fetch from "cross-fetch";

class SectionContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, sectionContent: null };
  }

  componentDidMount() {
    this.fetchSectionContent();
  }

  // https://reactjs.org/docs/react-component.html#componentdidupdate
  componentDidUpdate(prevProps) {
    if (this.props.section !== prevProps.section) {
      this.fetchSectionContent();
    }
  }

  fetchSectionContent() {
    this.setState({ loading: true });

    if (!this.props.date) {
      console.warn("No this.props.date!");
      this.setState({ loading: false, sectionContent: null });
      return;
    }
    if (!this.props.section) {
      this.setState({ loading: false, sectionContent: null });
      return;
    }
    if (this.props.section === INTERNAL.LOADING_PLACEHOLDER) {
      // It means the section meta data is still loading.
      return;
    }

    let serverURL =
      STRINGS.SECTION_CONTENT_SERVER_URL +
      this.props.date.format("YYYY/MM/DD") +
      "/" +
      this.props.section.sectionID +
      "." +
      this.props.section.type +
      ".txt";
    console.log(serverURL);
    fetch(serverURL)
      .then(e => e.text())
      .then(e => {
        //console.log(e);
        let allLines = e.split("\n");

        let sectionContent = {};
        sectionContent.title = allLines[0].substr(2); // Remove "# ".
        sectionContent.subtitle = allLines[1].substr(3); // Remove "## ".
        sectionContent.author = allLines[2].substr(4); // Remove "### ".
        sectionContent.content = allLines.slice(3).join("\n"); // First three lines (title, subtitle, and author) are not included in content
        this.setState({ loading: false, sectionContent: sectionContent });

        document.title = getDateTitle(this.props.date, sectionContent.title);

        console.log(this.preElement.scrollWidth);
        this.props.onScrollWidthChange(this.preElement.scrollWidth);
      });
  }

  render() {
    if (this.state.loading) {
      return <Loading containerClasses="NoBG" />;
    }

    if (!this.state.sectionContent) {
      return (
        <p className="SectionContent">
          <i>Select an article in the document viewer.</i>
        </p>
      );
    }
    
    // TODO: automatically resize the parent's `flex-basis` given the `pre`'s width (of the longest line) (to a max of 50% width).
    // TODO: resize back to default 30% after going back to issue.
    return (
      <div className="SectionContent">
        <Link
          className="CloseButton"
          title="Back to the issue list"
          href={this.props.backLink()}
        >
          <a>&times;</a>
        </Link>
        {this.state.sectionContent.title && (
          <h3>{this.state.sectionContent.title}</h3>
        )}
        {this.state.sectionContent.subtitle && (
          <h5>{this.state.sectionContent.subtitle}</h5>
        )}
        {this.state.sectionContent.author && (
          <p className="Author">
            By <strong>{this.state.sectionContent.author}</strong>
          </p>
        )}
        <hr />
        <pre ref={preElement => (this.preElement = preElement)}>
          {this.state.sectionContent.content}
        </pre>
      </div>
    );
  }
}

export default SectionContent;
