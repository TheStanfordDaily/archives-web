import React, { useEffect } from 'react';

import { STRINGS } from "../helpers/constants";

const CorrectionsView = () => {
    useEffect(() => {
        document.title = "Corrections" + STRINGS.SITE_NAME_WITH_DIVIDER;
    }, []);

    return ( 
        <div className="CorrectionsMainView">
            <div className="CorrectionsContent">
                <h1>Submit a Correction</h1>
                <iframe src={STRINGS.CORRECTIONS_GOOGLE_FORM} width="640" height="1200" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
            </div>
        </div> 
    );
}
 
export default CorrectionsView;