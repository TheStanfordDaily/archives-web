import { STRINGS } from "../helpers/constants";
import lucene from "lucene"
import queryString from "query-string";

export const DEFAULTS_FORM_DATA = {
    article_text: "",
    year_start: 1892,
    year_end: 2014,
    page: 1,
    pagelen: 20,
    author: undefined,
    title: undefined,
    article_type_article: true,
    article_type_advertisement: true,
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
        let query_string = "q.parser=lucene&q=";
        let lucene_string = "";
        if(query.article_text){
            lucene_string += add_and_lucene_string(lucene_string, 'article_text', query.article_text);
        }
        if(query.author){
            lucene_string += add_and_lucene_string(lucene_string, 'author', query.author);
        }
        if(query.year_start && query.year_end){
            lucene_string += add_and_lucene_string(lucene_string, 'publish_date', `[${query.year_start}-01-01T12:00:00Z TO ${query.year_end+1}-01-02T12:00:00Z]`);
        }
        if(query.title){
            lucene_string += add_and_lucene_string(lucene_string, 'title', query.title);
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
        query_string += lucene_query;

        if(query.resultsPerPage){
            query_string += `&size=${query.resultsPerPage}`;
        }
        if(query.pageNumber){
            query_string += `&start=${query.resultsPerPage * query.pageNumber}`;
        }
        if(query.highlight === 'article_text'){
            query_string += `&highlight.article_text=%7Bformat:'html',max_phrases:5%7D`; //this nailed me for an hour: must encode '{' and '}'
        }

        console.log(query_string);
        return query_string;
    } catch {
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

