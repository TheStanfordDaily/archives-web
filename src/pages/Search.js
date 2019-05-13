import React from 'react';
import Form from "react-jsonschema-form";

function ObjectFieldTemplate(props) {
  return (<div className = "container">
    <div className="row">
      {/* {props.title} */}
      {props.properties.map(element => element.content)}
    </div>
    </div>
  );
}

class Search extends React.Component {
  // componentDidMount() {
  // }

  // componentWillUnmount() {
  // }
 

  render() {

    let schema = {
      "type": "object",
      "properties": {
        "keyword": {
          title: "Keyword",
          "type": "string",
        },
        "advanced_options": {
          title: "Advanced Options",
          type: "object",
          properties : {
          "Search within": {
            "type": "string",
            "default":"Full text",
            "enum": ['Full text',"Article headlines"]
          },
          "search_summaries": {
            title: "Search summaries",
            "type": "string",
            "default": "None",
            "enum": ["None","Text", "Images"]
          },
          "results_per_page" : {
            title: "Results per page",
            "type": "number",
            "default": 20,
            "enum": [10,20,50]
          }
        }
        },
        "from": {
          title: "From",
          "type": "string",
        },
        "to": {
          title: "To",
          "type": "string",
          // "properties": {
          //   "Day":{
          //     type: "number",
          //     enum: day
          //   },
          //   "Month":{
          //     type: "string",
          //     enum: ["January","February", "March","April","May","June","July","August","September","October","November","December"]
          //   },
          //   "Year":{
          //     type:"number",
          //     enum: year,
          //   }
          // }
        }
      }
    };

    let uiSchema = {
      "classNames": "form col-12",
      "keyword": {
        "classNames": "form-row col-12",
        "ui:placeholder": "Enter keyword here"
      },
      "advanced_options" : {
        classNames: "col-12",
          "Search within":{
            "classNames": "col-md-4"
          },
          "search_summaries":{
            "classNames": "col-md-4"
          },
          "results_per_page":{
            "classNames": "col-md-4"
          }
      }, 
      "from" : {
        "classNames": "row col-12",
        "ui:widget":"alt-date"
      }, 
      "to" : {
        "classNames": "row col-12",
          "ui:widget":"alt-date"
      }, 
    }
    return (<div className = "container"> 
    <div><h2>Filter Archived Articles:</h2>
      <Form schema={schema} uiSchema={uiSchema}  ObjectFieldTemplate={ObjectFieldTemplate}
      onSubmit={e => console.log(e.formData)} />
      </div>
    </div>
    );
  }
}

export default Search;

