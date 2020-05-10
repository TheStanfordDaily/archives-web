import "rc-pagination/assets/index.css";

import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import { STRINGS, getDatePath } from "../helpers/constants";

import Form from "react-jsonschema-form";
import { Link } from "react-router-dom";
import Loading from "./components/Loading";
import Pagination from "rc-pagination";
import React from "react";
import { createCloudsearchQuery } from "../helpers/search";
import fetch from "cross-fetch";
import localeInfo from "rc-pagination/lib/locale/en_US";
import moment from "moment";
import queryString from "query-string";

export function sendCloudsearchFromForm(event, history) {
        const searchKeyword = event.target.elements.searchKeyword.value;
        if (searchKeyword) {
            history.push(getCloudsearchURL({ q: searchKeyword }));
        }
        event.preventDefault();
  }

export function getCloudsearchURL(formData) {
    return STRINGS.ROUTE_CLOUDSEARCH_PREFIX + "?" + queryString.stringify(formData);
}

export const DEFAULTS_FORM_DATA = {
  q: "",
  year_start: 1892,
  year_end: 2014,
  page: 1,
  pagelen: 20
};

class CloudsearchView extends React.Component {
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
              9980
            ) /* cloudsearch needs cursor to fetch results past result number 10000. (todo: implement cursor lol) */
          }
          showTotal={(total, range) =>
            `${range[0]} - ${range[1]} of ${total} results`
          }
          onChange={(current, pageSize) => {
            let newFormData = this.state.formData;
            newFormData.page = current;
            this.props.history.push(getCloudsearchURL(newFormData));
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
              this.props.history.push(getCloudsearchURL(formData));
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
    const searchQuery = createCloudsearchQuery({ 
      q: q, 
      resultsPerPage: resultsPerPage, 
      pageNumber: pageNumber, 
      highlight: 'article_text',
      year_start: year_start,
      year_end: year_end,
    });

    const serverSearchURL =
      STRINGS.CLOUDSEARCH_SEARCH_URL +
      "?" +
      searchQuery; // todo: make this more dynamic; user can choose what to highlight & we chose what to highlight, based on what the user searches for (title, authorname, text etc).
    fetch(serverSearchURL)
      .then(e => e.json())
      .then(e => {
        // TODO: handle error
        const hits = e.hits.hit;
        const resultsSize = e.hits.found - resultsPerPage;
        const results = hits.map(function(hit){
          const replace_text = {
            "\\.\\.\\.":'...<br><br>...',
            "<em>":"<mark>",
            "</em>":"</mark>"
          }
          var RE = new RegExp(Object.keys(replace_text).join("|"), "gi"); 
          const highlighted_text = (' ' + hit.highlights.article_text).slice(1).replace(RE, function(matched){
            if(matched === '...'){
              return replace_text['\\.\\.\\.'];
            }
            return replace_text[matched];
          });
          const text = '...' + highlighted_text + '...';
          const title = hit.fields.title;
          const type = hit.fields.article_type;
          const matchCount = 100; // idk what this is yet
          const raw_id = hit.id;
          const id = raw_id.substring(raw_id.indexOf(type) + type.length);
          const date = moment(new Date(hit.fields.publish_date));
          return {
            text: [text],
            title: title,
            type: type,
            matchCount: matchCount,
            id: id,
            date: date
          };
        });
        // TODO: sort results by `matchCount`?
        this.setState({
          searchResults: results,
          searchResultsSize: resultsSize,
          loading: false
        });
      });
  }
}
 
export default CloudsearchView;