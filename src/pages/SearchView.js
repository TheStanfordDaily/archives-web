import React from 'react';
import { Link } from "react-router-dom";
import Form from "react-jsonschema-form";
import queryString from 'query-string';
import fetch from "cross-fetch";
import moment from 'moment';
import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import Loading from './components/Loading';
import { createSearchQuery } from "../helpers/search";
import { STRINGS } from "../helpers/constants";

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


class SearchView extends React.Component {
  constructor(props) {
    super(props);
    let {q, year_start, year_end} = queryString.parse(window.location.search);
    // https://stackoverflow.com/a/4564199/2603230
    year_start = Number(year_start) || 1892;
    year_end = Number(year_end) || 1904;
    // TODO: add an error state
    this.state = {
      loading: true,
      searchResults: [],
      formData: {
        q,
        year_start,
        year_end
      }
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
    this.setState({ loading: true });

    const searchParameters = this.state.formData;
    console.log(searchParameters);
    if (searchParameters.q) {
      const q = searchParameters.q;
      // TODO: make sure `page` (x>=1) and `pagelen` (1<=x<=1000) is number and within the acceptable range.
      const pageNumber = searchParameters.page || 1;
      const resultsPerPage = searchParameters.pagelen || 20;
      const {year_start, year_end} = searchParameters;
      this.searchFor({ q, year_start, year_end, resultsPerPage: resultsPerPage, pageNumber: pageNumber });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      );
    }

    const range = Array.from({length: 2014 - 1892 + 1}, (x, i) => i + 1892);

    const schema = {
      type: "object",
      required: [
        "q"
      ],
      properties: {
        "q": {
          title: "Search",
          type: "string"
        },
        "year_start": {
          title: "From",
          type: "number",
          enum: "range"
        },
        "year_end": {
          title: "To",
          type: "number",
          enum: range
        }
      }
    };

    const uiSchema = {
      "q": {
        "ui:placeholder": "Enter keyword here"
      }
    };

    return (
      <div className="SearchMainView">
        <div className="SearchFilterSection">
          <h2>Filter Archived Articles</h2>
          <Form schema={schema}
            uiSchema={uiSchema}
            formData={this.state.formData}
            onChange={e => this.setState({formData: e.formData})}
            onSubmit={(e) => {
              const formData = e.formData;
              this.props.history.push(getSearchURL(formData));
            }}>
            <button type="submit" className="btn-dark btn-lg btn-block searchButton">Search</button>
          </Form>
          {/* TODO: add a collapse content button - only show title and date */}
        </div>
        <div className="SearchResultSection">
          {this.state.searchResults.length ?
            this.state.searchResults.map((eachResult, index) =>
              <div className="EachResult" key={index}>
                <h4 className="EachResultTitle">
                  {eachResult.type === "advertisement" ? <IoMdMegaphone /> : <IoIosPaper />}
                  <span><Link to={STRINGS.ROUTE_PAPER_PREFIX + eachResult.date.format("YYYY-MM-DD") + "#" + queryString.stringify({ "section[]": eachResult.id })}>{eachResult.title}</Link></span>
                  <span className="EachResultDate">{eachResult.date.format("MMMM DD, YYYY")}</span>
                </h4>
                <div className="EachResultTexts">
                  {eachResult.text.map((eachText, textIndex) =>
                    <p className="EachResultEachText" key={textIndex} dangerouslySetInnerHTML={{ __html: eachText }} />
                  )}
                </div>
              </div>
            ) :
            <div className="SearchResultNoResult">No results!</div>
          }
        </div>
      </div>
    );
  }

  searchFor({ q, year_start, year_end, searchWithin, searchSummaries, resultsPerPage = 20, pageNumber = 1, dateFrom, dateTo }) {
    const searchQuery = createSearchQuery({ query: q, year_start, year_end });
    console.log(searchQuery);

    const serverSearchParameters = {
      search_query: searchQuery,
      pagelen: resultsPerPage,
      page: pageNumber
    }

    // https://developer.atlassian.com/bitbucket/api/2/reference/resource/teams/%7Busername%7D/search/code
    const serverSearchURL = STRINGS.SEARCH_SERVER_URL + "?" + queryString.stringify(serverSearchParameters);
    console.log(serverSearchURL);
    fetch(serverSearchURL).then(e => e.json()).then(e => {
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
          console.warn("filepathSplited = [" + filepathSplited.toString() + "] does not have exactly 6 elements! Ignoring it...");
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
          console.warn("rawFilenameSplited = [" + rawFilenameSplited.toString() + "] does not have exactly 4 elements! Ignoring it...");
          continue;
        }
        const id = rawFilenameSplited[0];
        // https://stackoverflow.com/a/25840184/2603230 We are using UTF-8 for base64.
        const title = new Buffer(rawFilenameSplited[1], 'base64').toString();
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
      this.setState({ searchResults: results, loading: false });
    });
  }
}

export default SearchView;

