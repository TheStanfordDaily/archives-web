import React from 'react';
import OpenSeadragon from 'openseadragon';
import Paper from '../classes/Paper';
import { STRINGS } from '../helpers/constants';

class PaperView extends React.Component {
  async componentDidMount() {
    /*const path = require('path');

    var openseadragonImagesFolderPath = path.join(
      path.dirname(require.resolve('openseadragon')),
      "./images/"
    );
    console.log(openseadragonImagesFolderPath);*/

    await this.fetchAllPapers();

    //let testPaper = new Paper(1920, 10, 1, "data.2012-aug/data/stanford/1920/10/01_01/", "Stanford_Daily_19201001_0001-METS.xml");
    let testPaper = this.allPapers[10000];
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
    return (
      <div className="PaperView">
        <div id="openseadragon1" style={{ "width": 800, "height": 600}} />
      </div>
    );
  }

  async fetchAllPapers() {
    this.allPapers = [];
    let results = await fetch(STRINGS.FILE_SERVER_URL + "metadata.json").then(e => e.json());
    //console.log(results);
    for (var year in results) {
      for (var month in results[year]) {
        for (var day in results[year][month]) {
          let fullFilePath = results[year][month][day];
          // https://stackoverflow.com/a/5555607/2603230
          var folderPath = fullFilePath.substring(0, fullFilePath.lastIndexOf("/") + 1);
          var metsFilePath = fullFilePath.substring(fullFilePath.lastIndexOf("/") + 1, fullFilePath.length);
          let paper = new Paper(Number(year), Number(month), Number(day), folderPath, metsFilePath);
          //console.log(fullFilePath);
          this.allPapers.push(paper);
        }
      }
    }
    console.log(this.allPapers);
  }
}

export default PaperView;
