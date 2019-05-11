import React from 'react';
import OpenSeadragon from 'openseadragon';
import NotFound from './NotFound';
import { fetchPaper } from '../helpers/papers';

class PaperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paperNotFound: false };
  }

  async componentDidMount() {
    /*const path = require('path');

    var openseadragonImagesFolderPath = path.join(
      path.dirname(require.resolve('openseadragon')),
      "./images/"
    );
    console.log(openseadragonImagesFolderPath);*/


    //let paper = new Paper(1920, 10, 1, "data.2012-aug/data/stanford/1920/10/01_01/", "Stanford_Daily_19201001_0001-METS.xml");
    //let allPapers = await fetchAllPapers();
    //let paper = allPapers[10000];
    let matchParams = this.props.match.params;
    let paper = await fetchPaper(matchParams.year, matchParams.month, matchParams.day);
    if (paper === null) {
      this.setState({ paperNotFound: true });
      return;
    }

    let results = await paper.getPages();
    console.log(results);

    var allTileSources = [];
    for (let eachPage of results) {
      allTileSources.push(eachPage.getTileSource());
    }
    console.log(allTileSources);

    var viewer = new OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // TODO: change to local path
      preserveViewport: true,
      visibilityRatio: 1,
      minZoomLevel: 1,
      defaultZoomLevel: 1,
      sequenceMode: true,
      showReferenceStrip: true,
      showNavigator: true,
      tileSources: allTileSources
    });
  }

  componentWillUnmount() {
  }

  // TODO: Do we need this?
  // https://github.com/openseadragon/openseadragon/issues/942#issuecomment-222126576
  /*shouldComponentUpdate(nextProps, nextState) {
    return false
  }*/

  render() {
    if (this.state.paperNotFound) {
      return (
        <NotFound />
      );
    }
    return (
      <div className="PaperView">
        <div id="openseadragon1" style={{ "width": 800, "height": 600 }} />
      </div>
    );
  }
}

export default PaperView;
