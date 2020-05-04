import React from 'react';
import { STRINGS } from "../helpers/constants";
import queryString from "query-string";

export function sendCloudsearchFromForm(event, history) {
        const searchKeyword = event.target.elements.searchKeyword.value;
        if (searchKeyword) {
            history.push(getCloudsearchURL({ q: searchKeyword }));
        }
        event.preventDefault();
  }

export function getCloudsearchURL(formData) {
    console.log(STRINGS.ROUTE_CLOUDSEARCH_PREFIX + "?" + queryString.stringify(formData));
    return STRINGS.ROUTE_CLOUDSEARCH_PREFIX + "?" + queryString.stringify(formData);
}

const CloudsearchView = () => {
    return (
        <div>
            Cloudsearch View
        </div>
      );
}
 
export default CloudsearchView;