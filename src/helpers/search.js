export function createCloudsearchQuery(query){
    let query_string = "q=" + query.q;

    // consider using structured search 
    // note: you can view the amazon generated queries in cloudsearch console's example search by clicking on: "(view raw: JSON or XML)""
    // note: yes, you are allowed to have multiple fq's in a query string. It will do an "or" and not an "and". but for consistency, we will only have 1.
 
    let fq= "&fq=";

    if(query.resultsPerPage){
        query_string += `&size=${query.resultsPerPage}`;
    }
    if(query.pageNumber){
        query_string += `&start=${query.resultsPerPage * query.pageNumber}`;
    }
    if(query.year_start && query.year_end){
        fq += `publish_date:['${query.year_start}-01-01T12:00:00Z','${query.year_end+1}-01-02T12:00:00Z']`
    }
    
    // ugh: can't figure out the api gateway stuff for highlights.
    if(query.highlight === 'article_text'){
        query_string += `&highlight.article_text=%7Bformat:'html',max_phrases:5%7D`; //this nailed me for an hour: must encode '{' and '}'
    }

    // todo: write legit logic for fq's. not sure the best way to do this yet. Not needed for basic searches though, so can put to later.
    // maybe: we can assume that for any single fq, all things will be anded together,
    // and if we want to do an or, then we create append a new fq.

    // not supported yet.
    // if(query.articleType){
    //     query_string += `&fq=article_type:${query.articleType}`;
    // }
    
    return query_string + fq;
}