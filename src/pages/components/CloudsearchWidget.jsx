import { IoIosSearch } from 'react-icons/io';
import React from 'react';
import { sendCloudsearchFromForm } from '../CloudsearchView';
import { withRouter } from "react-router-dom";

const CloudsearchWidget = ({history}) => {
    return ( 
        <form
            onSubmit={e => sendCloudsearchFromForm(e, history)}
        >
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    name="searchKeyword"
                    placeholder="Search&hellip;"
                    required
                />
                <div className="input-group-append">
                    <button type="submit" className="form-control HomeSearchButton">
                        <IoIosSearch />
                    </button>
                </div>
            </div>
        </form>
     );
}
 
export default withRouter(CloudsearchWidget);