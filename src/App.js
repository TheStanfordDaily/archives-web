import React from 'react';
import logo from './logo.svg';
import './App.css';
import OpenSeadragon from 'openseadragon';
import Paper from './helpers/Paper';

class App extends React.Component {
  async componentDidMount() {
    /*const path = require('path');

    var openseadragonImagesFolderPath = path.join(
      path.dirname(require.resolve('openseadragon')),
      "./images/"
    );
    console.log(openseadragonImagesFolderPath);*/

    let testPaper = new Paper(1920, 10, 1, "data.2012-aug/data/stanford/1920/10/01_01/Stanford_Daily_19201001_0001-METS.xml");
    let results = await testPaper.getPages();
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
      debugMode: true, // TODO: REMOVE THIS
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
    return (
      <div className="App">
        <div id="openseadragon1" style={{ "width": 800, "height": 600}} />
      </div>
    );
  }
}

export default App;
