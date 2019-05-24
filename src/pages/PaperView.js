import React from 'react';
import { Link } from "react-router-dom";
import OpenSeadragon from 'openseadragon';
import moment from 'moment'
import queryString from 'query-string';
import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import NotFound from './NotFound';
import Loading from './components/Loading';
import SectionContent from './components/SectionContent';
import { fetchPaper } from '../helpers/papers';
import { castArray } from "../helpers/util";
import { STRINGS } from '../helpers/constants'

const navigationType = {
  ISSUE: 'issue',
  ARTICLE: 'article'
};

class PaperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paperNotFound: false, loading: true, navigationSelection: navigationType.ISSUE, selectedSections: [] };
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
      id: "paper-openseadragon",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // TODO: change to local path
      preserveViewport: true,
      visibilityRatio: 0.75,
      defaultZoomLevel: 1,
      sequenceMode: true,
      showReferenceStrip: false,
      showNavigator: true,
      tileSources: allTileSources
    });

    this.viewer.addHandler('page', (e) => { this.onPageChange(e.page) });


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

  // TODO: when there is `#section[]`, then display `navigationType.ARTICLE` in navigation by default.
  onHashChange() {
    let hashValue = queryString.parse(this.props.location.hash);
    console.log("Hash set/changed to:");
    console.log(hashValue);

    let pageNumber = Number(hashValue.page);

    // By default (and when the input is not a valid page number), go to page 1.
    // This is also used to trigger `onPageChange` (and `addOverlay` even by default).
    let pageIndex = 0;
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= this.allPages.length) {
      // `goToPage` is 0-indexed.
      pageIndex = pageNumber - 1;
    } else if (hashValue["section[]"]) {
      // If `#page` is not specified but `#section[]` is, then directly go to the page that contains the first `section`.

      let sectionIDs = castArray(hashValue["section[]"]);
      let pageNumberForSection = this.paper.getPageNumberFromSectionID(sectionIDs[0]);
      if (pageNumberForSection !== -1) {
        pageIndex = pageNumberForSection - 1;
      }
      console.log(sectionIDs[0] + " is on " + pageNumberForSection);
    }
    console.log("Going to page " + pageIndex);
    this.viewer.goToPage(pageIndex);

    this.setOverlays(pageIndex);
  }

  onPageChange(page) {
    // TODO: Not working for the initial view of the paper.
    // By default view the top of the page.
    var currentBounds = this.viewer.viewport.getBounds();
    var newBounds = new OpenSeadragon.Rect(0, 0, 1, currentBounds.height / currentBounds.width);
    this.viewer.viewport.fitBounds(newBounds, true);


    // `page` is 0-indexed.
    let pageNumber = page + 1;

    let hashValue = queryString.parse(this.props.location.hash);
    //console.log("hashValue.page is " + hashValue.page.toString() + "while pageNumber is " + pageNumber.toString());
    // Only use `history.replace` if current hash pageNumber is not equal to the new pageNumber.
    if (Number(hashValue.page) !== pageNumber) {
      console.log("Number(hashValue.page) !== pageNumber");
      hashValue.page = pageNumber;
      // Note that this seems NOT to call `onHashChange()`, so we want to call `setOverlays` here manually.
      this.props.history.replace("#" + queryString.stringify(hashValue));
      this.setOverlays(page);
    }
  }

  setOverlays(pageIndex) {
    this.viewer.clearOverlays();

    let hashValue = queryString.parse(this.props.location.hash);
    // For the name of `section[]`, see https://stackoverflow.com/a/9176496/2603230
    // For the use of `castArray`, it is to ensure the section var is an array even if the input has only one section (i.e. "section[]=...").
    let displayingSections = castArray(hashValue["section[]"]);
    let selectedSectionsObjects = [];
    if (displayingSections.length) {
      let thisPage = this.allPages[pageIndex];
      console.log(thisPage.sections);
      thisPage.getAltoData().then((results) => {
        console.log("finished getAltoData");
        console.log(results);

        let firstOverlayY = null;

        for (let eachSectionID of displayingSections) {
          let eachSection = thisPage.sections.find(obj => {
            return obj.sectionID === eachSectionID
          })
          console.log(eachSection);

          if (eachSection === undefined) {
            // It means that this section is probably not on this page.
            continue;
          }

          selectedSectionsObjects.push(eachSection);

          let allOverlays = eachSection.areaIDs;
          for (let eachOverlayType in allOverlays) {
            let overlayIDs = allOverlays[eachOverlayType];
            for (let eachID of overlayIDs) {
              let overlayPos = thisPage.getBlockPositionAndSize(eachID);

              if (firstOverlayY === null) {
                firstOverlayY = overlayPos.y;
              }

              var elt = document.createElement("div");
              elt.id = "overlay-page" + thisPage.pageNumber.toString() + "-" + eachSection.sectionID + "-" + eachID;
              elt.className = "SectionHighlight";
              this.viewer.addOverlay({
                element: elt,
                location: new OpenSeadragon.Rect(overlayPos.x, overlayPos.y, overlayPos.width, overlayPos.height)
              });
            }
          }
        }

        if (firstOverlayY) {
          let currentBounds = this.viewer.viewport.getBounds();
          var newBounds = new OpenSeadragon.Rect(0, firstOverlayY - 0.1, 1, currentBounds.height / currentBounds.width);
          this.viewer.viewport.fitBounds(newBounds, true);
        }
      });
    }
    this.setState({ selectedSections: selectedSectionsObjects });
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
            <div className="PaperNavigationSelectType">
              <div className="PaperNavigationSelection" onClick={() => this.setState({ navigationSelection: navigationType.ISSUE })}>Issue</div>
              <div className="PaperNavigationSelection" onClick={() => this.setState({ navigationSelection: navigationType.ARTICLE })}>Article</div>
            </div>
          </div>
          <div className="PaperNavigationItems">
            {this.state.navigationSelection === navigationType.ISSUE ?
              this.allPages.map((page) =>
                <div key={page.pageNumber}>
                  <h3 className="PageLabel">Page {page.pageLabel}</h3>
                  <ul>
                    {page.sections.map((section) =>
                      <li key={page.pageLabel + "-" + section.sectionID}>
                        {section.type === "advertisement" ? <IoMdMegaphone /> : <IoIosPaper />}
                        <span className="SectionTitle">
                          {/* We add one more `span` here because `SectionName` is `table-cell` and we only want onClick on the actual text. */}
                          <span className="SectionTitleLink" onClick={() => {
                            this.props.history.replace("#" + queryString.stringify({ page: page.pageNumber, "section[]": section.sectionID }));
                            // TODO: directly calling `onHashChange` cause delay. Have to do this.
                            setTimeout(function () {
                              this.onHashChange();  // Because `history.replace` does not call `onHashChange`.
                            }.bind(this), 0);
                          }}>{section.title}</span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              ) :
              <SectionContent date={moment(this.paper.date)} section={this.state.selectedSections && this.state.selectedSections[0]} />
            }
          </div>
        </div>
        <div className="PaperSection" id="paper-openseadragon" />
      </div>
    );
  }
}

export default PaperView;
