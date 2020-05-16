import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { getCloudsearchURL } from '../../helpers/search';
import { withRouter } from 'next/router';
import Router from 'next/router';

const CloudsearchWidget = ({history}) => {
    const [keyword, setKeyword] = useState("");
    return ( 
        <form
            onSubmit={e => {
                e.preventDefault();
                Router.push(getCloudsearchURL({ article_text: keyword }));
            }}
        >
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Search&hellip;"
                    required
                />
                <div className="input-group-append">
                    <button type="submit" className="form-control HomeSearchButton"
                    >
                        <IoIosSearch />
                    </button>
                </div>
            </div>
        </form>
     );
}
 
export default withRouter(CloudsearchWidget);