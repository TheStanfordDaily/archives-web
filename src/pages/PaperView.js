import React from 'react';
import OpenSeadragon from 'openseadragon';
import queryString from 'query-string';
import NotFound from './NotFound';
import { fetchPaper } from '../helpers/papers';

import "./css/PaperView.css"

class PaperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paperNotFound: false, loading: true };
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
      allTileSources.push(await eachPage.getTileSource());
    }
    console.log(allTileSources);
    this.setState({ loading: false });

    this.viewer = new OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // TODO: change to local path
      preserveViewport: true,
      visibilityRatio: 1,
      minZoomLevel: 1,
      defaultZoomLevel: 1,
      sequenceMode: true,
      showReferenceStrip: false,
      showNavigator: true,
      tileSources: allTileSources
    });

    this.viewer.addHandler("page", (e) => { this.onPageChange(e.page) });


    // Go to the page number given by the hash.
    this.onHashChange();

    // https://stackoverflow.com/a/38965945/2603230
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    this.bind_onHashChange = this.onHashChange.bind(this);
    window.addEventListener("hashchange", this.bind_onHashChange, false);
  }

  componentWillUnmount() {
    console.log("unmount");

    // https://stackoverflow.com/a/38965945/2603230
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    window.removeEventListener("hashchange", this.bind_onHashChange, false);
  }

  onHashChange() {
    let hashValue = queryString.parse(this.props.location.hash);
    console.log("Hash set/changed to:");
    console.log(hashValue);

    let pageNumber = Number(hashValue.page);
    if (!isNaN(pageNumber) && pageNumber > 0) {
      console.log("Going to page " + pageNumber);
      // `goToPage` is 0-indexed.
      this.viewer.goToPage(pageNumber - 1);
    } else {
      // By default, go to page 1.
      this.viewer.goToPage(0);
    }
  }

  onPageChange(page) {
    // `page` is 0-indexed.
    let pageNumber = page + 1;

    let hashValue = queryString.parse(this.props.location.hash);
    //console.log("hashValue.page is " + hashValue.page.toString() + "while pageNumber is " + pageNumber.toString());
    // Only use `history.push` if current hash pageNumber is not equal to the new pageNumber.
    if (Number(hashValue.page) !== pageNumber) {
      console.log("Number(hashValue.page) !== pageNumber");
      hashValue.page = pageNumber;
      this.props.history.push("#" + queryString.stringify(hashValue));
    }
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

    if (this.state.loading) {
      return (
        <div>Loading...</div>
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
