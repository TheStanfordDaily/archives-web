import { IoIosPaper, IoMdMegaphone } from 'react-icons/io';

import { Link } from 'react-router-dom';
import React from 'react';

const SearchResults = ({searchResults, getDatePath}) => {
    return ( 
        <div>
            {searchResults.map((eachResult, index) => (
                    <div className="EachResult" key={index}>
                    <h4 className="EachResultTitle">
                        {eachResult.type === "advertisement" ? (
                        <IoMdMegaphone />
                        ) : (
                        <IoIosPaper />
                        )}
                        <span>
                        <Link
                            to={getDatePath(eachResult.date, {
                            section: eachResult.id
                            })}
                        >
                            {eachResult.title}
                        </Link>
                        </span>
                        <span className="EachResultDate">
                        {eachResult.date.format("MMMM DD, YYYY")}
                        </span>
                    </h4>
                    <div className="EachResultTexts">
                        {eachResult.text.map((eachText, textIndex) => (
                        <p
                            className="EachResultEachText"
                            key={textIndex}
                            dangerouslySetInnerHTML={{ __html: eachText }}
                        />
                        ))}
                    </div>
                    </div>
                ))}
        </div> 
    );
}
 
export default SearchResults;