import { IoIosPaper, IoMdMegaphone } from 'react-icons/io';

import { Link } from 'react-router-dom';
import React from 'react';

const SearchResult = ({eachResult, getDatePath}) => {
    return (
        <div className="EachResult">
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
            {eachResult.subtitle &&
                <h5 className="EachResultSubtitle">{eachResult.subtitle}</h5>}
            {eachResult.author &&
                <h5 className="EachResultAuthor">By {eachResult.author.replace(/^\s+|\s+$/g, '')}{eachResult.author_title && `, ${eachResult.author_title}`}</h5>}
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
    );
}

const SearchResults = ({searchResults, getDatePath}) => {
    return ( 
        <div>
            {searchResults.map((eachResult) => (
                <SearchResult key={eachResult.date.format() + eachResult.id} eachResult={eachResult} getDatePath={getDatePath} />
            ))}
        </div> 
    );
}
 
export default SearchResults;