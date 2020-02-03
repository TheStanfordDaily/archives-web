import React from "react";
import { Link } from "react-router-dom";
import Form from "react-jsonschema-form";
import queryString from "query-string";
import fetch from "cross-fetch";
import moment from "moment";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/en_US";
import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import Loading from "./components/Loading";
import { createSearchQuery } from "../helpers/search";
import { STRINGS, getDatePath } from "../helpers/constants";

import "rc-pagination/assets/index.css";

export function sendSearchFromForm(event, history) {
  const searchKeyword = event.target.elements.searchKeyword.value;
  if (searchKeyword) {
    history.push(getSearchURL({ q: searchKeyword }));
  }
  event.preventDefault();
}

export function getSearchURL(formData) {
  //console.log(keyword);
  return STRINGS.ROUTE_SEARCH_PREFIX + "?" + queryString.stringify(formData);
}

export const DEFAULTS_FORM_DATA = {
  q: "",
  year_start: 1892,
  year_end: 2014,
  page: 1,
  pagelen: 20
};

class SearchView extends React.Component {
  constructor(props) {
    super(props);

    // TODO: add an error state
    this.state = {
      loading: true,
      searchResults: [],
      searchResultsSize: -1,
      formData: {}
    };
  }

  componentDidMount() {
    this.startSearchFromQuery();
  }

  // https://reactjs.org/docs/react-component.html#componentdidupdate
  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.startSearchFromQuery();
    }
  }

  startSearchFromQuery() {
    let { q, year_start, year_end, page, pagelen } = queryString.parse(
      window.location.search
    );
    // https://stackoverflow.com/a/4564199/2603230
    year_start = Number(year_start) || DEFAULTS_FORM_DATA.year_start;
    year_end = Number(year_end) || DEFAULTS_FORM_DATA.year_end;
    page = Number(page) || DEFAULTS_FORM_DATA.page;
    pagelen = Number(pagelen) || DEFAULTS_FORM_DATA.pagelen;
    this.setState({
      loading: true,
      formData: {
        q,
        year_start,
        year_end,
        page,
        pagelen
      }
    });

    if (q) {
      document.title =
        "Search results for " + q + STRINGS.SITE_NAME_WITH_DIVIDER;
      // TODO: make sure `page` (x>=1) and `pagelen` (1<=x<=1000) is number and within the acceptable range.
      this.searchFor({
        q,
        year_start,
        year_end,
        resultsPerPage: pagelen,
        pageNumber: page
      });
    } else {
      document.title = "Search" + STRINGS.SITE_NAME_WITH_DIVIDER;
      this.setState({ loading: false });
    }
  }

  render() {
    const range = Array.from({ length: 2014 - 1892 + 1 }, (x, i) => i + 1892);

    const schema = {
      type: "object",
      required: ["q"],
      properties: {
        q: {
          title: "Search",
          type: "string",
          default: DEFAULTS_FORM_DATA.q
        },
        year_start: {
          title: "From",
          type: "number",
          enum: range,
          default: DEFAULTS_FORM_DATA.year_start
        },
        year_end: {
          title: "To",
          type: "number",
          enum: range,
          default: DEFAULTS_FORM_DATA.year_end
        },
        /** Hidden properties **/
        page: {
          title: "Page Number",
          type: "number",
          default: DEFAULTS_FORM_DATA.page
        },
        pagelen: {
          title: "Results Per Page",
          type: "number",
          default: DEFAULTS_FORM_DATA.pagelen
        }
        // TODO: add support for other search such as "section type"
      }
    };

    const uiSchema = {
      q: {
        "ui:placeholder": "Enter keyword here"
      },
      page: {
        "ui:widget": "hidden"
      },
      pagelen: {
        "ui:widget": "hidden"
      }
    };

    const pagination = (
      <>
        <Pagination
          locale={localeInfo}
          showQuickJumper
          defaultPageSize={this.state.formData.pagelen}
          defaultCurrent={this.state.formData.page}
          total={
            Math.min(
              this.state.searchResultsSize,
              1000
            ) /* BitBucket cannot fetch results past result number 1000. */
          }
          showTotal={(total, range) =>
            `${range[0]} - ${range[1]} of ${total} results`
          }
          onChange={(current, pageSize) => {
            let newFormData = this.state.formData;
            newFormData.page = current;
            this.props.history.push(getSearchURL(newFormData));
          }}
        />
        {/* TODO: add number per page with `select` (10/20/50/100/500) and a `checkbox` to display/hide article content here */}
      </>
    );

    return (
      <div className="SearchMainView">
        <div className="SearchFilterSection">
          <h2>Filter Archived Articles</h2>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            idPrefix="search"
            formData={this.state.formData}
            onSubmit={e => {
              let formData = e.formData;
              formData.page = 1;  // Reset the results to the first page.
              this.props.history.push(getSearchURL(formData));
            }}
          >
            <button
              type="submit"
              className="btn-dark btn-lg btn-block searchButton"
              disabled={
                this.state.loading /* disable search button when loading */
              }
            >
              Search
            </button>
          </Form>
          {/* TODO: add a collapse content button - only show title and date */}
        </div>
        <div className="SearchResultSection">
          {this.state.loading ? (
            <Loading containerClasses="NoBG" />
          ) : this.state.searchResults.length ? (
            <div className="SearchResultAllResultsContent">
              <div className="EachResult SearchPagination">{pagination}</div>
              {this.state.searchResults.map((eachResult, index) => (
                <div className="EachResult" key={index}>
                  <h4 className="EachResultTitle">
                    {eachResult.type === "advertisement" ? (
                      <IoMdMegaphone />
                    ) : (
                      <IoIosPaper />
                    )}
                    <span>
                      <Link
                        to={getDatePath(eachResult.date, {
                          section: eachResult.id
                        })}
                      >
                        {eachResult.title}
                      </Link>
                    </span>
                    <span className="EachResultDate">
                      {eachResult.date.format("MMMM DD, YYYY")}
                    </span>
                  </h4>
                  <div className="EachResultTexts">
                    {eachResult.text.map((eachText, textIndex) => (
                      <p
                        className="EachResultEachText"
                        key={textIndex}
                        dangerouslySetInnerHTML={{ __html: eachText }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {/* TODO: add a notice with `EachResult` class here to notice the user that there query has return >1000 results and only first 1000 can be shown and please limit query */}
              <div className="EachResult SearchPagination">{pagination}</div>
            </div>
          ) : (
            <div className="SearchResultNoResult">No results!</div>
          )}
        </div>
      </div>
    );
  }

  searchFor({
    q,
    year_start,
    year_end,
    searchWithin,
    searchSummaries,
    resultsPerPage = 20,
    pageNumber = 1,
    dateFrom,
    dateTo
  }) {
    const searchQuery = createSearchQuery({ query: q, year_start, year_end });
    console.log(searchQuery);

    const serverSearchParameters = {
      search_query: searchQuery,
      pagelen: resultsPerPage,
      page: pageNumber
    };

    // https://developer.atlassian.com/bitbucket/api/2/reference/resource/teams/%7Busername%7D/search/code
    const serverSearchURL =
      STRINGS.SEARCH_SERVER_URL +
      "?" +
      queryString.stringify(serverSearchParameters);
    console.log(serverSearchURL);
    fetch(serverSearchURL)
      .then(e => e.json())
      .then(e => {
        // TODO: handle error
        console.log(e);
        const resultsSize = e.size;
        let results = [];
        for (let eachResultSection of e.values) {
          const matchCount = eachResultSection.content_match_count;
          const filepath = eachResultSection.file.path;
          const filepathSplited = filepath.split("/");
          //console.log(filepathSplited);
          if (filepathSplited.length !== 6) {
            console.warn(
              "filepathSplited = [" +
                filepathSplited.toString() +
                "] does not have exactly 6 elements! Ignoring it..."
            );
            continue;
          }
          const year = Number(filepathSplited[2].slice(0, -1));
          const month = Number(filepathSplited[3].slice(0, -1));
          const day = Number(filepathSplited[4].slice(0, -1));
          const date = moment(new Date(year, month - 1, day));
          //console.log(date);
          const rawFilename = filepathSplited[5];
          const rawFilenameSplited = rawFilename.split(".");
          //console.log(rawFilenameSplited);
          if (rawFilenameSplited.length !== 4) {
            console.warn(
              "rawFilenameSplited = [" +
                rawFilenameSplited.toString() +
                "] does not have exactly 4 elements! Ignoring it..."
            );
            continue;
          }
          const id = rawFilenameSplited[0];
          // https://stackoverflow.com/a/25840184/2603230 We are using UTF-8 for base64.
          const title = new Buffer(rawFilenameSplited[1], "base64").toString();
          const type = rawFilenameSplited[2];
          //console.log(title);

          let text = [];
          for (let eachMatches of eachResultSection.content_matches) {
            let thisLine = "&hellip; ";
            for (let eachSubline of eachMatches.lines) {
              for (let eachSegments of eachSubline.segments) {
                if (eachSegments.match) {
                  thisLine += "<mark>";
                }
                thisLine += eachSegments.text;
                if (eachSegments.match) {
                  thisLine += "</mark>";
                }
              }
              thisLine = thisLine.trim() + " ";
            }
            thisLine = thisLine.trim() + " &hellip;";
            text.push(thisLine);
          }
          //console.log(text);
          results.push({
            date: date,
            id: id,
            title: title,
            matchCount: matchCount,
            type: type,
            text: text
          });
        }
        console.log(results);
        // TODO: sort results by `matchCount`?
        this.setState({
          searchResults: results,
          searchResultsSize: resultsSize,
          loading: false
        });
      });
  }
}

export default SearchView;
