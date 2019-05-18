import React from 'react';
import Form from "react-jsonschema-form";
import CustomDateWidget from "./components/form/CustomDateWidget";

import "./css/SearchView.css";

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
      {(label && !hideLabel) && <label className={labelClassNames} htmlFor={id}>{label}{required ? "*" : null}</label>}
      {description}
      {childrenClassNames ? <div className={childrenClassNames}>{children}</div> : children}
      {errors}
      {help}
    </div>
  );
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
  render() {
    const widgets = {
      customDateWidget: CustomDateWidget
    };

    const schema = {
      type: "object",
      properties: {
        "first_row": {
          type: "object",
          properties: {
            "keyword": {
              title: "Search",
              type: "string",
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
          classNames: "col-md-5 form-row",
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
          classNames: "col-md-5 form-row",
          labelClassNames: "col-form-label",
          childrenClassNames: "col",
          "ui:widget": "customDateWidget",
          "ui:options": {
            yearsRange: [1892, 2014], // TODO: should we hardcode this?
            hideNowButton: true,
            hideClearButton: true
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
            onSubmit={e => console.log(e.formData)} />
        </div>
        <div className="SearchContent">
          <div className="SearchNavigationSection">
            Navigate me!
          </div>
          <div className="SearchResultSection">
            Hello World!
          </div>
        </div>
      </div>
    );
  }
}

export default SearchView;

