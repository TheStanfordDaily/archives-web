import React from 'react';
import fetch from "cross-fetch";
import { STRINGS } from '../../helpers/constants'

class SectionContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, paperContent: null };
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
    if (!this.props.date) {
      console.warn("No this.props.date!");
      this.setState({ loading: false, paperContent: null });
      return;
    }
    if (!this.props.section) {
      this.setState({ loading: false, paperContent: null });
      return;
    }

    let serverURL = STRINGS.SECTION_CONTENT_SERVER_URL + this.props.date.format("YYYY/MM/DD") + "/" + this.props.section.sectionID + "." + this.props.section.type + ".txt";
    console.log(serverURL);
    fetch(serverURL).then(e => e.text()).then(e => {
      console.log(e);
      this.setState({ loading: false, paperContent: e });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <p><i>Loading&hellip;</i></p>
      );
    }

    if (!this.state.paperContent) {
      return (
        <p><i>Select an article in the document viewer.</i></p>
      );
    }

    return (
      <pre>
        {this.state.paperContent}
      </pre>
    );
  }
}

export default SectionContent;
