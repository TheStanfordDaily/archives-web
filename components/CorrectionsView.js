import React, { useEffect, useState } from 'react';

import { STRINGS } from "../helpers/constants";
import _ from 'lodash';
import queryString from "query-string";

// from https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

const CorrectionsView = () => {
    let [prefillData, setPrefillData] = useState(null);

    useEffect(() => {
        document.title = "Corrections" + STRINGS.SITE_NAME_WITH_DIVIDER;
    }, []);

    useEffect(() => {
        let prefillDataFromUrl = {...STRINGS.CORRECTIONS_GOOGLE_FORM_PREFILL};
        for (let key in prefillDataFromUrl ) {
            prefillDataFromUrl[key] = getQueryVariable(key);
        }
        if(!_.isEqual(prefillDataFromUrl, prefillData)){
            setPrefillData(prefillDataFromUrl);
        }
    });

    let correctedPrefillData = {};
    for (let key in prefillData ) {
        correctedPrefillData[STRINGS.CORRECTIONS_GOOGLE_FORM_PREFILL[key]] = prefillData[key];
    }
    let correctionsFormUrl = STRINGS.CORRECTIONS_GOOGLE_FORM + "&" + queryString.stringify(correctedPrefillData);

    return ( 
        <div className="CorrectionsMainView">
            <div className="CorrectionsContent">
                <h1>Submit a Correction</h1>
                <iframe src={correctionsFormUrl} width="640" height="1600" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </div>
        </div> 
    );
}
 
export default CorrectionsView;