import {
  INTERNAL,
  STRINGS,
  getDatePath,
  getDateTitle,
  getMonthPath
} from "../helpers/constants";
import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import Router, { withRouter } from "next/router";

import Link from "next/link";
import Loading from "./components/Loading";
import NotFound from "./NotFound";
import Paper from "../classes/Paper";
import React from "react";
import SectionContent from "./components/SectionContent";
import { castArray } from "../helpers/util";
import { fetchPaper } from "../helpers/papers";
import moment from "moment";
import queryString from "query-string";

const navigationType = {
  ISSUE: "issue",
  ARTICLE: "article"
};

const defaultNavigationPercentage = 30;

if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({}),
    documentElement: {}
  };
  global.window = {
    addEventListener: () => null,
    removeEventListener: () => null,
    location: {
      search: ""
    }
  };
  global.navigator = {

  };
}

// We will load these modules in componentDidMount() to ensure
// that they only load in the browser (as they are only compatible
// with the browser)
let OpenSeadragon = null;
let interact = null;

/*
 * Returns the hash from a URL. Next JS's router doesn't
 * automatically do this parsing for us.
 */
export const getHash = router => {
  const path = router.asPath.split("#")[1];
  return path;
}

/*
 * Returns the query string from a URL. Next JS's router doesn't
 * automatically do this parsing for us.
 */
export const getQueryString = router => {
  const path = router.asPath.split(/[\?\#]/)[1];
  return queryString.parse(path);
}

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

  static async getInitialProps(param) {
    let matchParams = param.query;
    const paper = await fetchPaper(
      matchParams.year,
      matchParams.month,
      matchParams.day
    );
    paper && await paper.fetchPages(); //paper.getPages();

    // TODO: prefetch alto data
    // let pageNumber = Number(param.query.page);
    // // `goToPage` is 0-indexed.
    // let pageIndex = pageNumber - 1;

    // let thisPage = this.allPages[pageIndex];
    //   console.log(thisPage.sections);
    //   thisPage.getAltoData()
    return { paper };
  }

  async componentDidMount() {

    if (!OpenSeadragon || !interact) {
      OpenSeadragon = require("openseadragon");
      interact = require("interactjs");
    }

    const { date, folderPath, metsFilePath, prefetchedPages } = this.props.paper;
    // console.log("PAPER PROPS", this.props.paper);
    // hardcode date for now so it can be manually set with this.paper.date
    this.paper = new Paper(1, 1, 2000, folderPath, metsFilePath, prefetchedPages);
    // console.log("DATE", date);
    this.paper.date = date;
    // console.log("this.paper.date1", this.paper.date);
    this.allPages = this.paper && await this.paper.getPages();
    if (this.paper === null) {
      this.setState({ paperNotFound: true });
      return;
    }

    var allTileSources = [];
    for (let eachPage of this.allPages) {
      allTileSources.push(eachPage.getTileSource());
    }
    // console.log(allTileSources);
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
    if (this.props.router.asPath !== prevProps.router.asPath) {
      // console.log(
      //   "location.search changes from " +
      //   prevProps.router.asPath +
      //     " to " +
      //     this.props.router.asPath
      // );
      this.onQueryChange();
    }
  }

  onQueryChange() {
    // This might be overriden by `SectionContent`.
    document.title = getDateTitle(this.paper.date);
    // console.log("this.paper.date2", this.paper.date);
    // console.log("set title to ", document.title);

    let queryValue = getQueryString(this.props.router);
    // console.log("Query set/changed to:");
    // console.log(queryValue);

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
    } else if (queryValue.section) {
      // If `#page` is not specified but `?section` is, then directly go to the page that contains the first `section`.

      let sectionIDs = castArray(queryValue.section);
      let pageNumberForSection = this.paper.getPageNumberFromSectionID(
        sectionIDs[0]
      );
      if (pageNumberForSection !== -1) {
        pageIndex = pageNumberForSection - 1;
      }
      // console.log(sectionIDs[0] + " is on " + pageNumberForSection);
    }
    // console.log("Going to page " + pageIndex);
    this.viewer.goToPage(pageIndex);

    this.setOverlays(pageIndex);

    // Go to the right hash (issue / article):
    this.setNavigationSelection(getHash(this.props.router) || navigationType.ISSUE);
  }

  onPageChange(page) {
    // `page` is 0-indexed.
    let pageNumber = page + 1;

    this.scrollToPageNumber();

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
    
    let queryValue = getQueryString(this.props.router);
    // Only change the current page if current query pageNumber is not equal to the new pageNumber.
    if (Number(queryValue.page) !== pageNumber) {
      // If we are navigating from the search page, then queryValue.page will be undefined; in this
      // case, we don't want to add a new history entry (or it will be impossible to navigate back),
      // so we should run Router.replace instead of Router.push.
      const pushOrReplace = queryValue.page === undefined ? Router.replace: Router.push;
      queryValue.page = pageNumber;
      pushOrReplace(
         "/[year]/[month]/[day]",
         getDatePath(
            this.paper.date,
            queryValue,
            getHash({asPath: window.location.href}) // TODO: this.props.router doesn't work here
          )
      );
    }
  }

  setOverlays(pageIndex) {
    this.viewer.clearOverlays();
    this.setState({
      selectedSections: []
    });

    let queryValue = getQueryString(this.props.router);
    // For the name of `section`, see https://stackoverflow.com/a/9176496/2603230
    // For the use of `castArray`, it is to ensure the section var is an array even if the input has only one section (i.e. "section=...").
    let displayingSections = castArray(queryValue.section);
    if (displayingSections.length) {
      this.setState({
        selectedSections: [INTERNAL.LOADING_PLACEHOLDER]
      });
      let thisPage = this.allPages[pageIndex];
      // console.log(thisPage.sections);
      thisPage.getAltoData().then(results => {
        // console.log("finished getAltoData");
        // console.log(results);

        let firstOverlayY = null;

        let selectedSectionsObjects = [];

        for (let eachSectionID of displayingSections) {
          let eachSection = thisPage.sections.find(obj => {
            return obj.sectionID === eachSectionID;
          });
          // console.log(eachSection);
         

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
    // console.log(percent);

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

  getNavigationSelectionLink(selection) {
    let path = this.props.router.asPath.split("#")[0]; // gets the url except for the hash
    return path + "#" + selection;
  }

  setNavigationSelection(selection) {
    this.setState({ navigationSelection: selection }, () => {
      this.scrollToPageNumber();
    });
    if (selection === navigationType.ISSUE) {
      this.setNavigationWidthFromPercent(defaultNavigationPercentage);
    }
  }
  getNavigationSelectionClasses(selection) {
    let classes = "PaperNavigationSelection";
    if (this.state.navigationSelection === selection) {
      classes += " Active";
    }
    return classes;
  }

  scrollToPageNumber() {
    let queryValue = getQueryString(this.props.router);
    let pageNumber = Number(queryValue.page);
    let articleListEle = document && document.querySelector("#page-" + pageNumber);
    if (articleListEle) {
      articleListEle.scrollIntoView();
    }
  }

  render() {
    if (this.state.paperNotFound) {
      return <NotFound />;
    }

    if (this.state.loading) {
      return <Loading />;
    }

    let correctionsDate = new Date(this.paper.date);
    let correctionsPrefill = {...STRINGS.CORRECTIONS_GOOGLE_FORM_PREFILL};
    correctionsPrefill.day = correctionsDate.getDay();
    correctionsPrefill.month = correctionsDate.toLocaleString('default', { month: 'long' });
    correctionsPrefill.year = correctionsDate.getFullYear();
    if(this.state.selectedSections.length && this.state.selectedSections[0].sectionID){
      correctionsPrefill.article_num = this.state.selectedSections[0].sectionID.match(/\d+/)[0];
      correctionsPrefill.article_type = this.state.selectedSections[0].type === "advertisement" ? "Advertisement" : "Article";
    }else{
      correctionsPrefill.article_num = 0;
      correctionsPrefill.article_type = "Article"
    }
    let correctionHref = STRINGS.ROUTE_CORRECTIONS + (queryString.stringify(correctionsPrefill) ? "?" + queryString.stringify(correctionsPrefill) : "");
    console.log(correctionHref);


    return (
      <div className="PaperMainView">
        <div
          className="NavigationSection"
          style={{ flexBasis: this.state.navigationPercentage + "%" }}
        >
          <div className="PaperTitleBar">
            <div className="PaperTitleInfo">
              <h1>
                <time>{moment(this.paper.date).utc().format("YYYY-MM-DD")}</time>
              </h1>
              <p className="BackToCalendarButton">
                <Link href={getMonthPath(this.paper.date)}>
                  <a>Back to {moment(this.paper.date).format("MMMM YYYY")}</a>
                </Link>
              </p>
            </div>
            <div className="PaperNavigationSelectType">
                <a href={this.getNavigationSelectionLink(navigationType.ISSUE)}
                onClick={(e) => {
                  e.preventDefault();
                  Router.push(this.getNavigationSelectionLink(navigationType.ISSUE));
                  this.setNavigationSelection(navigationType.ISSUE);
                }}
                className={this.getNavigationSelectionClasses(
                  navigationType.ISSUE
                )}>Issue</a>
<a href={this.getNavigationSelectionLink(navigationType.ARTICLE)}
                onClick={(e) => {
                  e.preventDefault();
                  Router.push(this.getNavigationSelectionLink(navigationType.ARTICLE));
                  this.setNavigationSelection(navigationType.ARTICLE);
                }}
                className={this.getNavigationSelectionClasses(
                  navigationType.ARTICLE
                )}>Article</a>
            </div>
          </div>
          <div
            className="PaperNavigationItems"
            ref={navElement => (this.navElement = navElement)}
          >
            {this.state.navigationSelection === navigationType.ISSUE ? (
              this.allPages.map(page => (
                <div
                  key={page.pageNumber}
                  id={"page-" + page.pageNumber}
                  className="EachPageArticleList"
                >
                  <h3 className="PageLabel">
                    Page {page.pageLabel}{" "}
                    <Link
                      href={getDatePath(
                        this.paper.date,
                        {
                          page: page.pageNumber
                        },
                        navigationType.ISSUE
                      )}
                    >
                      <a title={"Go to Page " + page.pageLabel}>&rarr;</a>
                    </Link>
                  </h3>
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
                            href="/[year]/[month]/[day]"
                            as={getDatePath(
                              this.paper.date,
                              {
                                page: page.pageNumber,
                                section: section.sectionID
                              },
                              navigationType.ARTICLE
                            )}
                          >
                            <a>{section.title}</a>
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div>
              <SectionContent
                date={moment(this.paper.date).utc()}
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
                  // console.log(pxWidth);
                  this.setNavigationWidthFromPxWidth(pxWidth);
                }}
                backLink={() => {
                  let queryValue = getQueryString(this.props.router);
                  return getDatePath(
                    this.paper.date,
                    {
                      page: queryValue.page
                    },
                    navigationType.ISSUE
                  );
                }}
              />
              <p>See an Error? Submit a <Link title="correction" href={correctionHref}>
                  <a target="_blank">
                    correction
                  </a>
                </Link>!</p>
              </div>
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

export default withRouter(PaperView);
