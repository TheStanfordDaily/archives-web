import "rc-pagination/assets/index.css";

import { DEFAULTS_FORM_DATA, createCloudsearchQuery, getCloudsearchURL } from "../helpers/search";
import { STRINGS, getDatePath } from "../helpers/constants";

import Form from "react-jsonschema-form";
import Loading from "./components/Loading";
import Pagination from "rc-pagination";
import React from "react";
import SearchResults from "./components/SearchResults";
import fetch from "cross-fetch";
import localeInfo from "rc-pagination/lib/locale/en_US";
import moment from "moment";
import queryString from "query-string";

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
    let { article_text, author, title, article_type_article, article_type_advertisement, start_date, end_date, page, pagelen, author_title } = queryString.parse(
      window.location.search
    );
    // https://stackoverflow.com/a/4564199/2603230
    start_date = start_date || DEFAULTS_FORM_DATA.start_date;
    end_date = end_date || DEFAULTS_FORM_DATA.end_date;
    page = Number(page) || DEFAULTS_FORM_DATA.page;
    pagelen = Number(pagelen) || DEFAULTS_FORM_DATA.pagelen;
    article_type_article = article_type_article ? article_type_article === 'true' : DEFAULTS_FORM_DATA.article_type_article;
    article_type_advertisement = article_type_advertisement ? article_type_advertisement === 'true' : DEFAULTS_FORM_DATA.article_type_advertisement;
    this.setState({
      loading: true,
      formData: {
        article_text,
        start_date,
        end_date,
        page,
        pagelen,
        author,
        title,
        article_type_article,
        article_type_advertisement,
        author_title,
      }
    });

    document.title =
      "Search results for " + article_text + STRINGS.SITE_NAME_WITH_DIVIDER;
    // TODO: make sure `page` (x>=1) and `pagelen` (1<=x<=1000) is number and within the acceptable range.
    this.searchFor({
      article_text,
      start_date,
      end_date,
      resultsPerPage: pagelen,
      pageNumber: page,
      author,
      title,
      article_type_article,
      article_type_advertisement,
      author_title,
    });
  }

  render() {
    const schema = {
      type: "object",
      required: [],
      properties: {
        article_text: {
          title: "Article Text",
          type: "string",
          default: DEFAULTS_FORM_DATA.article_text
        },
        title: {
          title: "Article Title",
          type: "string",
          default: DEFAULTS_FORM_DATA.title
        },
        author: {
          title: "Author",
          type: "string",
          default: DEFAULTS_FORM_DATA.author
        },
        author_title: {
          title: "Author Title",
          enum: ['SENIOR STAFF WRITER', 'STAFF WRITER', 'DESK EDITOR', 
          'MANAGING EDITOR', 'EDITOR IN CHIEF', 'DEPUTY EDITOR', 'EXECUTIVE EDITOR', 'STAFF', 
          'ASSU President', 'ASSU Parlimentarian', 'STAFF FOOTBALL WRITERS', 'FASHION COLUMNIST', 
          'FOOTBALL EDITOR', 'ARTS EDITOR', 'FOOD EDITOR', 'FOOD DINING EDITOR', 'OPINIONS DESK',
          'FOOD DRUNK EDITOR', 'FELLOW', 'DAILY INTERN', 'CONTRIBUTING EDITOR', 'MANAGING WRITER',
          'GUEST COLUMNIST', 'SEX GODDESS', 'GUEST COLUMNISTS', 'EDITORIAL STAKE', 'CONTRIBUTING YANKEE',
          'SPECIAL CONTRIBUTOR', 'EDITORIAL BOARD', 'CONTRIBUTING WRITER', 'EDITORIAL STAFF', 'FILM CRITIC',
          'HEALTH EDITOR', 'ASSHOLE', 'INTERMISSION', 'NEWS EDITOR', 'CLASS PRESIDENT', 'ASSOCIATED PRESS',
          'AP SPORTS WRITER', 'AP BASEBALL WRITER', 'WEEKLY COLUMNIST', 'HEALTH COLUMNIST', 'ASSOCIATED EDITOR',
          'ASSOCIATE EDITOR', 'SPORTS EDITOR', 'EDITOR THE DAILY', ],
        },
        start_date: {
          title: "From",
          type: "string",
          format: "date",
          default: DEFAULTS_FORM_DATA.start_date,
        },
        end_date: {
          title: "To",
          type: "string",
          format: "date",
          default:  DEFAULTS_FORM_DATA.end_date,
        },
        article_type_article: {
          title: " Articles",
          type: "boolean",
          default: DEFAULTS_FORM_DATA.article_type_article,
        },
        article_type_advertisement: {
          title: " Advertisements",
          type: "boolean",
          default: DEFAULTS_FORM_DATA.article_type_advertisement,
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
      article_text: {
        "ui:placeholder": "Leave empty to search all"
      },
      author: {
        "ui:placeholder": "Leave empty to search all"
      },
      title: {
        "ui:placeholder": "Leave empty to search all"
      },
      author_title: {
        "ui:placeholder": "Leave empty to search all"
      },
      page: {
        "ui:widget": "hidden"
      },
      pagelen: {
        "ui:widget": "hidden"
      },
      start_date: {
        "ui:widget": "alt-date",
        "ui:options": {
          "yearsRange": [
            1892,
            2014
          ],
          hideNowButton: true,
          hideClearButton: true,
        }
      },
      end_date: {
        "ui:widget": "alt-date",
        "ui:options": {
          "yearsRange": [
            1892,
            2014
          ],
          hideNowButton: true,
          hideClearButton: true,
        }
      },
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
              10000
            ) /* cloudsearch needs cursor to fetch results past result number 10000. (todo: implement cursor lol) */
          }
          showTotal={(total, range) =>
            `${range[0]} - ${range[1]} of ${total} results`
          }
          onChange={(current, pageSize) => {
            let newFormData = this.state.formData;
            newFormData.page = current;
            console.log(newFormData);
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
              <SearchResults searchResults={this.state.searchResults} getDatePath={getDatePath} />
              
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
    article_text,
    start_date,
    end_date,
    resultsPerPage = 20,
    pageNumber = 1,
    author,
    title,
    article_type_article,
    article_type_advertisement,
    author_title,
  }) {      
    const searchQuery = createCloudsearchQuery({ 
      article_text: article_text, 
      resultsPerPage: resultsPerPage, 
      pageNumber: pageNumber, 
      highlight: 'article_text',
      start_date: start_date,
      end_date: end_date,
      author: author,
      title: title,
      article_type_article: article_type_article,
      article_type_advertisement: article_type_advertisement,
      author_title: author_title,
    });

    if(!searchQuery){
      alert("error in search query!");
      this.props.history.push(getCloudsearchURL(DEFAULTS_FORM_DATA));
      return;
    }

    const serverSearchURL =
      STRINGS.CLOUDSEARCH_SEARCH_URL +
      "?" +
      searchQuery;
    console.log(searchQuery);
    fetch(serverSearchURL)
    .then(e => e.json())
    .then(e => {
      // TODO: handle error
      if(!e.hits){
        e.hits = {found: 0, hit: []};
      }
      const hits = e.hits.hit;
      const resultsSize = e.hits.found;
      const results = hits.map(function(hit){
        const replace_text = {
          "\\.\\.\\.":'...<br>...',
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
        const subtitle = hit.fields.subtitle;
        const author = hit.fields.author;
        const author_title = hit.fields.author_title;
        const type = hit.fields.article_type;
        const matchCount = 100; // idk what this is yet
        const raw_id = hit.id;
        const id = raw_id.substring(raw_id.indexOf(type) + type.length);
        const date = moment(new Date(hit.fields.publish_date));
        return {
          text: [text],
          subtitle: subtitle,
          title: title,
          author: author,
          author_title: author_title,
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