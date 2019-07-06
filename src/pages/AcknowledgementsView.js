import React from "react";
import { STRINGS } from "../helpers/constants";

class AcknowledgementsView extends React.Component {
  componentDidMount() {
    document.title = "Acknowledgements" + STRINGS.SITE_NAME_WITH_DIVIDER;
  }
  render() {
    return (
      <div className="AcknowledgementsMainView">
        <h1>Acknowledgements</h1>
        <div className="AcknowledgementsContent">
          <p>
            The Stanford Daily Archives would not have been possible without the
            vision and determination of Charlie Hoffman '73, MBA '76. Hoffman,
            the editor-in-chief of Vol. 163, worked tirelessly to oversee the
            life of this project, ensuring that we could present more than 120
            years of Stanford history in its original form. For that, and for
            all of his dedication to the Daily, we are grateful.
          </p>
          <p>
            We would also like to acknowledge the hard work of Ed Kohn '73,
            whose assistance was an integral part of the archives launch, and
            the continued support of The Friends of the Stanford Daily
            Foundation.
          </p>
          <p>
            The Stanford Daily thanks the following for sponsoring digitized
            volumes:
          </p>
          <ul>
            <li>Ben Hur</li>
            <li>Rich Jaroslovsky</li>
            <li>Ivan Maisel</li>
            <li>Devin Banerjee</li>
            <li>Elise McDonald</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default AcknowledgementsView;
