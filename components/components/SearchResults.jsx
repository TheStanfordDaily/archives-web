import { DEFAULTS_FORM_DATA, getCloudsearchURL } from '../../helpers/search';
import { IoIosPaper, IoMdMegaphone } from 'react-icons/io';

import Link from "next/link";
import React from 'react';

const SearchResult = ({eachResult, getDatePath}) => {
    let author_data = {...DEFAULTS_FORM_DATA};
    if(eachResult.author){
        author_data.author = eachResult.author;
    }
    let author_title_data = {...DEFAULTS_FORM_DATA};
    if(eachResult.author_title){
        author_title_data.author_title = eachResult.author_title;
    }
    let year_data = {...DEFAULTS_FORM_DATA}; 
    year_data.start_date = eachResult.date.format("YYYY-MM-DD");
    year_data.end_date = eachResult.date.format("YYYY-MM-DD");

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
                    href="[year]/[month]/[day]"
                    as={getDatePath(eachResult.date, {
                    section: eachResult.id
                    })}
                ><a>
                    {eachResult.title}
                </a>
                </Link>
                </span>
                <span className="EachResultDate">
                    <Link href={getCloudsearchURL(year_data)}><a>{eachResult.date.format("MMMM DD, YYYY")}</a></Link>
                </span>
            </h4>
            {eachResult.subtitle &&
                <h5 className="EachResultSubtitle">{eachResult.subtitle}</h5>}
            {eachResult.author &&
                <h5 className="EachResultAuthor">By <Link href={getCloudsearchURL(author_data)}><a>{eachResult.author.replace(/^\s+|\s+$/g, '')}</a></Link>{eachResult.author_title && <Link href={getCloudsearchURL(author_title_data)}><a>{`, ${eachResult.author_title}`}</a></Link>}</h5>}
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