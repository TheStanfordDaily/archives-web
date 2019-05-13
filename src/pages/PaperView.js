import React from 'react';
import { Link } from "react-router-dom";
import OpenSeadragon from 'openseadragon';
import moment from 'moment'
import queryString from 'query-string';
import NotFound from './NotFound';
import Loading from './components/Loading';
import { fetchPaper } from '../helpers/papers';
import { STRINGS } from '../helpers/constants'

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
    this.paper = await fetchPaper(matchParams.year, matchParams.month, matchParams.day);
    if (this.paper === null) {
      this.setState({ paperNotFound: true });
      return;
    }

    this.allPages = await this.paper.getPages();
    console.log(this.allPages);

    var allTileSources = [];
    for (let eachPage of this.allPages) {
      allTileSources.push(eachPage.getTileSource());
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
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= this.allPages.length) {
      console.log("Going to page " + pageNumber);
      // `goToPage` is 0-indexed.
      this.viewer.goToPage(pageNumber - 1);
    } else {
      // By default (and when the input is not a valid page number), go to page 1.
      // This is also used to trigger `onPageChange` (and `addOverlay` even by default).
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

    let thisPage = this.allPages[page];
    console.log(thisPage);

    thisPage.getAltoData().then((results) => {
      console.log("finished getAltoData");
      console.log(results);

      for (let eachSection of thisPage.sections) {
        let overlayIDs = eachSection.areaIDs;
        console.log(thisPage.getSectionText(eachSection));
        for (let eachID of overlayIDs) {
          let overlayPos = thisPage.getBlockPositionAndSize(eachID);

          var elt = document.createElement("div");
          elt.id = "overlay-page" + thisPage.pageNumber.toString() + "-" + eachSection.sectionID + "-" + eachID;
          elt.className = "highlight";
          this.viewer.addOverlay({
            element: elt,
            location: new OpenSeadragon.Rect(overlayPos.x, overlayPos.y, overlayPos.width, overlayPos.height)
          });
        }
      }
    });
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
        <Loading />
      );
    }

    return (
      <div className="PaperMainView">
        <div className="NavigationSection">
          <div className="PaperTitleBar">
            <h1>{moment(this.paper.date).format("YYYY-MM-DD")}</h1>
            <p className="BackToCalendarButton"><Link to={STRINGS.ROUTE_CALENDAR_PREFIX + moment(this.paper.date).format("YYYY/MM/")}>Back to {moment(this.paper.date).format("MMMM YYYY")}</Link></p>
          </div>
          <div className="PaperNavigationItems">
            {this.allPages.map((page) =>
              <div key={page.pageLabel}>
                <h3 className="PageLabel">Page {page.pageLabel}</h3>
                <ul>
                  {page.sections.map((section) =>
                    <li key={page.pageLabel + "-" + section.sectionID} onClick={() => this.viewer.goToPage(page.pageNumber - 1) /* `- 1` because `goToPage` is 0-based. */}><span>{section.title}</span></li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="PaperSection" id="openseadragon1" />
      </div>
    );
  }
}

export default PaperView;
