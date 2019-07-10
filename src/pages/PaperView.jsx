import React from "react";
import { Link } from "react-router-dom";
import interact from "interactjs";
import OpenSeadragon from "openseadragon";
import moment from "moment";
import queryString from "query-string";
import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import NotFound from "./NotFound";
import Loading from "./components/Loading";
import SectionContent from "./components/SectionContent";
import { fetchPaper } from "../helpers/papers";
import { castArray } from "../helpers/util";
import { INTERNAL, getDateTitle, getMonthPath } from "../helpers/constants";

const navigationType = {
  ISSUE: "issue",
  ARTICLE: "article"
};

const defaultNavigationPercentage = 30;

class PaperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperNotFound: false,
      loading: true,
      navigationSelection: navigationType.ISSUE,
      selectedSections: [],
      navigationPercentage: defaultNavigationPercentage,
      customNavigationWidth: false
    };
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
    this.paper = await fetchPaper(
      matchParams.year,
      matchParams.month,
      matchParams.day
    );
    if (this.paper === null) {
      this.setState({ paperNotFound: true });
      return;
    }
    this.setNavigationSelection(navigationType.ISSUE);

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

    // TODO: this might be called many many times? Need check
    this.viewer.addHandler("page", e => {
      this.onPageChange(e.page);
    });

    // Go to the page number given by the query.
    this.onQueryChange();

    // TODO: this is called many many times. Need to remove when unmount
    // TODO: also check other classes' componentDidMount
    interact(".NavigationSection")
      .resizable({
        // TODO: make `bottom: true` and `top: false` when on smaller screen
        edges: { left: false, right: true, bottom: false, top: false } // TODO: maybe use div and then display none for one side?
      })
      .on(
        "resizemove",
        function(event) {
          this.setNavigationWidthFromPxWidth(event.rect.width, true);
          this.setState({ customNavigationWidth: true });
        }.bind(this)
      );
  }

  // https://reactjs.org/docs/react-component.html#componentdidupdate
  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      console.log(
        "location.search changes from " +
          prevProps.location.search +
          " to " +
          this.props.location.search
      );
      this.onQueryChange();
    }
  }

  onQueryChange() {
    let queryValue = queryString.parse(this.props.location.search);
    console.log("Query set/changed to:");
    console.log(queryValue);

    let pageNumber = Number(queryValue.page);

    // By default (and when the input is not a valid page number), go to page 1.
    // This is also used to trigger `onPageChange` (and `addOverlay` even by default).
    let pageIndex = 0;
    if (
      !isNaN(pageNumber) &&
      pageNumber > 0 &&
      pageNumber <= this.allPages.length
    ) {
      // `goToPage` is 0-indexed.
      pageIndex = pageNumber - 1;
    } else if (queryValue["section[]"]) {
      // If `#page` is not specified but `#section[]` is, then directly go to the page that contains the first `section`.

      let sectionIDs = castArray(queryValue["section[]"]);
      let pageNumberForSection = this.paper.getPageNumberFromSectionID(
        sectionIDs[0]
      );
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
    var newBounds = new OpenSeadragon.Rect(
      0,
      0,
      1,
      currentBounds.height / currentBounds.width
    );
    this.viewer.viewport.fitBounds(newBounds, true);

    // `page` is 0-indexed.
    let pageNumber = page + 1;

    let queryValue = queryString.parse(this.props.location.search);
    //console.log("queryValue.page is " + queryValue.page.toString() + "while pageNumber is " + pageNumber.toString());
    // Only use `history.replace` if current query pageNumber is not equal to the new pageNumber.
    if (Number(queryValue.page) !== pageNumber) {
      console.log("Number(queryValue.page) !== pageNumber");
      queryValue.page = pageNumber;
      this.props.history.replace("?" + queryString.stringify(queryValue));
    }
  }

  setOverlays(pageIndex) {
    this.viewer.clearOverlays();
    this.setState({
      selectedSections: [],
      navigationSelection: navigationType.ISSUE
    });

    let queryValue = queryString.parse(this.props.location.search);
    // For the name of `section[]`, see https://stackoverflow.com/a/9176496/2603230
    // For the use of `castArray`, it is to ensure the section var is an array even if the input has only one section (i.e. "section[]=...").
    let displayingSections = castArray(queryValue["section[]"]);
    if (displayingSections.length) {
      this.setState({
        navigationSelection: navigationType.ARTICLE,
        selectedSections: [INTERNAL.LOADING_PLACEHOLDER]
      });
      let thisPage = this.allPages[pageIndex];
      console.log(thisPage.sections);
      thisPage.getAltoData().then(results => {
        console.log("finished getAltoData");
        console.log(results);

        let firstOverlayY = null;

        let selectedSectionsObjects = [];

        for (let eachSectionID of displayingSections) {
          let eachSection = thisPage.sections.find(obj => {
            return obj.sectionID === eachSectionID;
          });
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
              elt.id =
                "overlay-page" +
                thisPage.pageNumber.toString() +
                "-" +
                eachSection.sectionID +
                "-" +
                eachID;
              elt.className = "SectionHighlight";
              this.viewer.addOverlay({
                element: elt,
                location: new OpenSeadragon.Rect(
                  overlayPos.x,
                  overlayPos.y,
                  overlayPos.width,
                  overlayPos.height
                )
              });
            }
          }
        }

        if (firstOverlayY) {
          let currentBounds = this.viewer.viewport.getBounds();
          var newBounds = new OpenSeadragon.Rect(
            0,
            firstOverlayY - 0.1,
            1,
            currentBounds.height / currentBounds.width
          );
          this.viewer.viewport.fitBounds(newBounds, true);
        }

        this.setState({ selectedSections: selectedSectionsObjects });
        if (!selectedSectionsObjects.length) {
          // Go back to ISSUE view if no section text is actually displayed.
          this.setState({ navigationSelection: navigationType.ISSUE });
        }
      });
    }
  }

  // TODO: Do we need this?
  // https://github.com/openseadragon/openseadragon/issues/942#issuecomment-222126576
  /*shouldComponentUpdate(nextProps, nextState) {
    return false
  }*/

  setNavigationWidthFromPxWidth(pxWidth, force = false) {
    let percent = (pxWidth / window.innerWidth) * 100;
    console.log(percent);

    this.setNavigationWidthFromPercent(percent, force);
  }

  setNavigationWidthFromPercent(percent, force = false) {
    if (!force && this.state.customNavigationWidth) {
      // Do not reset width if the user has already dragged the navigation width manually
      // (unless `force` is true).
      return;
    }

    let newPercent = percent;
    // Resize to at least 25% width and at most 75% width.
    newPercent = Math.min(newPercent, 75);
    newPercent = Math.max(newPercent, 25);
    this.setState({ navigationPercentage: newPercent });
  }

  setNavigationSelection(selection) {
    this.setState({ navigationSelection: selection });
    if (selection === navigationType.ISSUE) {
      this.setNavigationWidthFromPercent(defaultNavigationPercentage);
      document.title = getDateTitle(this.paper.date);
    }
  }
  getNavigationSelectionClasses(selection) {
    let classes = "PaperNavigationSelection";
    if (this.state.navigationSelection === selection) {
      classes += " Active";
    }
    return classes;
  }

  render() {
    if (this.state.paperNotFound) {
      return <NotFound />;
    }

    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <div className="PaperMainView">
        <div
          className="NavigationSection"
          style={{ flexBasis: this.state.navigationPercentage + "%" }}
        >
          <div className="PaperTitleBar">
            <div className="PaperTitleInfo">
              <h1>{moment(this.paper.date).format("YYYY-MM-DD")}</h1>
              <p className="BackToCalendarButton">
                <Link to={getMonthPath(this.paper.date)}>
                  Back to {moment(this.paper.date).format("MMMM YYYY")}
                </Link>
              </p>
            </div>
            <div className="PaperNavigationSelectType">
              <div
                className={this.getNavigationSelectionClasses(
                  navigationType.ISSUE
                )}
                onClick={() =>
                  this.setNavigationSelection(navigationType.ISSUE)
                }
              >
                Issue
              </div>
              <div
                className={this.getNavigationSelectionClasses(
                  navigationType.ARTICLE
                )}
                onClick={() =>
                  this.setNavigationSelection(navigationType.ARTICLE)
                }
              >
                Article
              </div>
            </div>
          </div>
          <div
            className="PaperNavigationItems"
            ref={navElement => (this.navElement = navElement)}
          >
            {this.state.navigationSelection === navigationType.ISSUE ? (
              this.allPages.map(page => (
                <div key={page.pageNumber}>
                  <h3 className="PageLabel">Page {page.pageLabel}</h3>
                  <ul>
                    {page.sections.map(section => (
                      <li key={page.pageLabel + "-" + section.sectionID}>
                        {section.type === "advertisement" ? (
                          <IoMdMegaphone />
                        ) : (
                          <IoIosPaper />
                        )}
                        <span className="SectionTitle">
                          {/* We add one more `span` here because `SectionName` is `table-cell` and we only want onClick on the actual text. */}
                          <Link
                            className="SectionTitleLink"
                            to={
                              "?" +
                              queryString.stringify({
                                page: page.pageNumber,
                                "section[]": section.sectionID
                              })
                            }
                          >
                            {section.title}
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <SectionContent
                date={moment(this.paper.date)}
                section={
                  this.state.selectedSections.length
                    ? this.state.selectedSections[0]
                    : null
                }
                onScrollWidthChange={scrollWidth => {
                  const scrollbarWidth =
                    this.navElement.offsetWidth - this.navElement.clientWidth;
                  // 40px is for padding-left: 20px; and padding-right: 20px;
                  let pxWidth = scrollWidth + scrollbarWidth + 40;
                  console.log(pxWidth);
                  this.setNavigationWidthFromPxWidth(pxWidth);
                }}
              />
            )}
          </div>
        </div>
        <div
          className="PaperSection"
          id="paper-openseadragon"
          style={{ flexBasis: 100 - this.state.navigationPercentage + "%" }}
        />
      </div>
    );
  }
}

export default PaperView;
