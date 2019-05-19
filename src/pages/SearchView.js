import React from 'react';
import { Link } from "react-router-dom";
import Form from "react-jsonschema-form";
import queryString from 'query-string';
import fetch from "cross-fetch";
import moment from 'moment';
import { IoIosPaper, IoMdMegaphone } from "react-icons/io";
import Loading from './components/Loading';
import CustomDateWidget from "./components/form/CustomDateWidget";
import { createSearchQuery } from "../helpers/search";
import { STRINGS } from "../helpers/constants";

export function getSearchURL({ keyword, searchWithin, searchSummaries, resultsPerPage, pageNumber, dateFrom, dateTo }) {
  //console.log(keyword);
  return STRINGS.ROUTE_SEARCH_PREFIX + "?" + queryString.stringify({ q: keyword, page: pageNumber, pagelen: resultsPerPage });
}

// To avoid the use of `<fieldset>`.
function PlainFormTemplate(props) {
  return (
    <>
      {props.properties.map(element => element.content)}
    </>
  );
}

// To support `labelClassNames`, `childrenClassNames`, and `hideLabel`.
function CustomFieldTemplate(props) {
  const { id, classNames, label, help, required, description, errors, children } = props;
  const labelClassNames = props.uiSchema.labelClassNames;
  const childrenClassNames = props.uiSchema.childrenClassNames;
  const hideLabel = props.uiSchema.hideLabel;
  return (
    <div className={classNames}>
      {(label && !hideLabel) && <label className={labelClassNames} htmlFor={id}>{label}</label>}
      {description}
      {childrenClassNames ? <div className={childrenClassNames}>{children}</div> : children}
      {errors}
      {help}
    </div>
  );
}

function CustomButtonWidget(props) {
  const classNames = props.options.classNames || "";
  const buttonText = props.options.buttonText || "Untitled Button";
  const onClick = props.options.onClick || (() => {});
  return (
    <>
      <button type="submit" className={"btn btn-primary" + (classNames && " " + classNames)} onClick={(e) => onClick(e)}>{buttonText}</button>
    </>
  )
}

/*const CustomTextInputWidget = (props) => {
  console.log(props);
  const optionInputClassNames = props.options.inputClassNames;
  const inputClassNames = optionInputClassNames ? (" " + optionInputClassNames) : "";
  return (
    <input type="text"
      className={"form-control" + inputClassNames}
      value={props.value}
      required={props.required}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange(event.target.value)} />
  );
};

const widgets = {
  customTextInputWidget: CustomTextInputWidget
};*/

class SearchView extends React.Component {
  constructor(props) {
    super(props);

    // TODO: add an error state
    this.state = { loading: true, searchResults: [] };
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

    this.searchParameters = queryString.parse(this.props.location.search);
    console.log(this.searchParameters);
    if (this.searchParameters.q) {
      const q = this.searchParameters.q;
      // TODO: make sure `page` (x>=1) and `pagelen` (1<=x<=1000) is number and within the acceptable range.
      const pageNumber = this.searchParameters.page || 1;
      const resultsPerPage = this.searchParameters.pagelen || 20;
      this.searchFor({ keyword: q, resultsPerPage: resultsPerPage, pageNumber: pageNumber });
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

    const widgets = {
      customDateWidget: CustomDateWidget,
      customButtonWidget: CustomButtonWidget
    };

    const schema = {
      type: "object",
      properties: {
        "first_row": {
          type: "object",
          required: [
            "keyword"
          ],
          properties: {
            "keyword": {
              title: "Search",
              type: "string",
              default: this.searchParameters.q
            },
            "search_within": {
              title: "within",
              type: "string",
              default: "Full text",
              enum: ["Full text", "Article headlines"]
            },
            "search_summaries": {
              title: "and show",
              type: "string",
              default: "None",
              enum: ["None", "Text", "Images"]
            },
            "results_per_page": {
              title: "Results per page",
              type: "number",
              default: 20,
              enum: [10, 20, 50]
            }
          }
        },
        "second_row": {
          type: "object",
          properties: {
            "date_from": {
              title: "From",
              type: "string",
            },
            "date_to": {
              title: "To",
              type: "string",
            },
            "search_button": {
              title: "Search",
              type: "string",
            }
          }
        }
      }
    };

    const uiSchema = {
      "first_row": {
        classNames: "form-row",
        hideLabel: true,
        "keyword": {
          classNames: "col-lg-4 col-md-6 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col",
          "ui:placeholder": "Enter keyword here"
        },
        "search_within": {
          classNames: "col-lg-3 col-md-6 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col"
        },
        "search_summaries": {
          classNames: "col-lg-2 col-md-6 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col"
        },
        "results_per_page": {
          classNames: "col-lg-3 col-md-6 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col"
        }
      },
      "second_row": {
        classNames: "form-row",
        hideLabel: true,
        "date_from": {
          classNames: "col-lg-4 col-md-5 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col",
          "ui:widget": "customDateWidget",
          "ui:options": {
            yearsRange: [1892, 2014], // TODO: should we hardcode this?
            hideNowButton: true,
            hideClearButton: true
          }
        },
        "date_to": {
          classNames: "col-lg-3 col-md-5 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col",
          "ui:widget": "customDateWidget",
          "ui:options": {
            yearsRange: [1892, 2014], // TODO: should we hardcode this?
            hideNowButton: true,
            hideClearButton: true
          }
        },
        "search_button": {
          classNames: "col-lg-5 col-md-2",
          hideLabel: true,
          "ui:widget": "customButtonWidget",
          "ui:options": {
            buttonText: "Search",
          }
        }
      }
    };

    return (
      <div className="SearchMainView">
        <div className="SearchFilterSection">
          {/*<h2>Filter Archived Articles:</h2>*/}
          <Form schema={schema}
            uiSchema={uiSchema}
            ObjectFieldTemplate={PlainFormTemplate}
            FieldTemplate={CustomFieldTemplate}
            widgets={widgets}
            ref={(form) => { this.form = form; }}
            onSubmit={(e) => {
              const formData = e.formData;
              console.log(formData);
              const keyword = formData.first_row.keyword;
              this.props.history.push(getSearchURL({ keyword: keyword }));
            }}>
            <>{/* Handle submission using the `search_button` button above. */}</>
          </Form>
        </div>
        <div className="SearchContent">
          <div className="SearchNavigationSection">
            Navigate me!
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
                      <p className="EachResultEachText" key={textIndex} dangerouslySetInnerHTML={{__html: eachText}} />
                    )}
                  </div>
                </div>
              ) :
              <div>No results!</div>
            }
          </div>
        </div>
      </div>
    );
  }

  searchFor({ keyword, searchWithin, searchSummaries, resultsPerPage = 20, pageNumber = 1, dateFrom, dateTo }) {
    const searchQuery = createSearchQuery({ query: keyword });
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
                thisLine += "<b>";
              }
              thisLine += eachSegments.text;
              if (eachSegments.match) {
                thisLine += "</b>";
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

