import { STRINGS } from "../helpers/constants";
import lucene from "lucene"
import queryString from "query-string";

export const DEFAULTS_FORM_DATA = {
    article_text: "",
    start_date: "1892-09-19",
    end_date: "2014-06-13",
    page: 1,
    pagelen: 20,
    author: undefined,
    title: undefined,
    article_type_article: true,
    article_type_advertisement: true,
    author_title: undefined,
    sort: 'relevance',
  };
  
function add_and_lucene_string(lucene_string, key, val){
    return ` ${lucene_string.length > 0 ? 'AND' : ''} ${key}:${val}`; 
}

function add_and_lucene_nested_string(lucene_string, string){
    return ` ${lucene_string.length > 0 ? 'AND' : ''} (${string})`; 
}

function add_or_lucene_string(lucene_string, key, val){
    return ` ${lucene_string.length > 0 ? 'OR' : ''} ${key}:${val}`; 
}
  
export function createCloudsearchQuery(query){
    try {
        let lucene_string = "";
        if(query.article_text){
            lucene_string += add_and_lucene_string(lucene_string, 'article_text', query.article_text);
        }
        if(query.author){
            lucene_string += add_and_lucene_string(lucene_string, 'author', '"' + query.author + '"');
        }
        if(query.start_date && query.end_date){
            lucene_string += add_and_lucene_string(lucene_string, 'publish_date', `[${query.start_date}T00:00:00Z TO ${query.end_date}T23:59:59Z]`);
        }
        if(query.title){
            lucene_string += add_and_lucene_string(lucene_string, 'title', '"' + query.title + '"');
        }if(query.author_title){
            lucene_string += add_and_lucene_string(lucene_string, 'author_title', '"' + query.author_title + '"');
        }
        let article_type_lucene_string = ""
        if(query.article_type_article !== undefined && query.article_type_article){
            article_type_lucene_string += add_or_lucene_string(article_type_lucene_string, 'article_type', 'article');
        }
        if(query.article_type_advertisement !== undefined && query.article_type_advertisement){
            article_type_lucene_string += add_or_lucene_string(article_type_lucene_string, 'article_type', 'advertisement');
        }
        lucene_string += add_and_lucene_nested_string(lucene_string, article_type_lucene_string)
        const ast = lucene.parse(lucene_string);
        let lucene_query = lucene.toString(ast);
        let query_obj = {"q.parser": "lucene", "q": lucene_query};

        if(query.resultsPerPage){
            query_obj = {...query_obj, "size": query.resultsPerPage};
        }
        if(query.pageNumber){
            if(!query.resultsPerPage){
                throw new Error("must have results per page if specifying page number");
            }
            query_obj = {...query_obj, "start": query.resultsPerPage * (query.pageNumber-1)};
        }
        if(query.highlight === 'article_text'){
            query_obj = {...query_obj, "highlight.article_text": "{format:'html',max_phrases:5}"};
        }
        if(query.sort === 'date (descending)'){
            query_obj = {...query_obj, "sort": "publish_date desc"}
        }else if(query.sort === 'date (ascending)'){
            query_obj = {...query_obj, "sort": "publish_date asc"}
        }

        return queryString.stringify(query_obj);
    } catch(error){
        return undefined;
    }
}

export function getCloudsearchURL(formData) {
    return STRINGS.ROUTE_CLOUDSEARCH_PREFIX + "?" + queryString.stringify(formData);
}

export function sendCloudsearchFromForm(event, history) {
    const searchKeyword = event.target.elements.searchKeyword.value;
    if (searchKeyword) {
        history.push(getCloudsearchURL({ article_text: searchKeyword }));
    }
    event.preventDefault();
}

