import React from 'react';
import logo from './logo.svg';
import './App.css';
import OpenSeadragon from 'openseadragon';

class App extends React.Component {
  componentDidMount() {
    /*const path = require('path');

    var openseadragonImagesFolderPath = path.join(
      path.dirname(require.resolve('openseadragon')),
      "./images/"
    );
    console.log(openseadragonImagesFolderPath);*/

    var allPages = [];
    for (var i = 1; i <= 4; i++) {
      let imageURL = "http://3.92.210.170:8888/s3:data.2012-aug/data/stanford/1920/10/01_01/Stanford_Daily-IMG/Stanford_Daily_19201001_0001_000" + i.toString() + ".jp2";
      /*let eachPage = {
        "@context": "http://iiif.io/api/image/2/context.json",
        "@id": imageURL,
        // TODO: check size.
        "height": 7200,
        "width": 5233,
        "profile": ["http://iiif.io/api/image/2/level2.json"],
        "protocol": "http://iiif.io/api/image",
        "tiles": [{
          "scaleFactors": [1, 2, 4, 8, 16, 32],
          "width": 1024
        }]
      };*/

      let eachPage = imageURL + "/info.json";

      console.log(eachPage);
      allPages.push(eachPage);
    }

    console.log(allPages);

    var viewer = new OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // TODO: change to local path
      preserveViewport: true,
      visibilityRatio: 1,
      minZoomLevel: 1,
      defaultZoomLevel: 1,
      sequenceMode: true,
      debugMode: true, // TODO: REMOVE THIS
      tileSources: allPages /*[
        {
          type: 'image',
          url: '/1.png'
        },
        {
          "@context": "http://iiif.io/api/image/2/context.json",
          "@id": "http://3.92.210.170:8888/s3:data.2012-aug/data/stanford/1920/10/01_01/Stanford_Daily-IMG/Stanford_Daily_19201001_0001_0001.jp2",
          "height": 7200,
          "width": 5233,
          "profile": ["http://iiif.io/api/image/2/level2.json"],
          "protocol": "http://iiif.io/api/image",
          "tiles": [{
            "scaleFactors": [1, 2, 4, 8, 16, 32],
            "width": 1024
          }]
        },
      ]*/
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
