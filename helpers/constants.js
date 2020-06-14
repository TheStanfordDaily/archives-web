import moment from "moment";
import queryString from "query-string";

export const STRINGS = {
  PAGE_TITLE_DIVIDER: " - ",
  SITE_NAME: "The Stanford Daily Archives",
  SITE_NAME_WITH_DIVIDER: " - Stanford Daily Archives",
  FILE_SERVER_URL: "https://tiles.archives.stanforddaily.com/",
  IMAGE_SERVER_URL: "https://tiles.archives.stanforddaily.com/",
  CLOUDSEARCH_SEARCH_URL: "https://ehabp6fuc5.execute-api.us-east-1.amazonaws.com/prod",
  SECTION_CONTENT_SERVER_URL: "https://raw.githubusercontent.com/TheStanfordDaily/archives-text/master/",
  ROUTE_ROOT: "/",
  ROUTE_CALENDAR: "/calendar",
  ROUTE_ACKNOWLEDGEMENTS: "/acknowledgements",
  ROUTE_CORRECTIONS: "/corrections",
  ROUTE_CLOUDSEARCH_PREFIX: '/search', 
  GOOGLE_ANALYTICS_TRACKING_ID: "UA-5773957-6",
  CORRECTIONS_GOOGLE_FORM: "https://docs.google.com/forms/d/e/1FAIpQLSf8BdqmWzBnOTVg9AS_diCDUbLO-JB3T_BJHo72PzwQGZo5oQ/viewform?embedded=true",
  CORRECTIONS_GOOGLE_FORM_PREFILL: {
    year: "entry.1772093325",
    month: "entry.336350248",
    day: "entry.400521547",
    article_type: "entry.1225480261",
    article_num: "entry.2002440206",
    incorrect_text: "entry.2028841586",
  },
}

export const INTERNAL = {
  LOADING_PLACEHOLDER: "___LOADING___"
}

export function getDateTitle(date, sectionTitle = null) {
  let results =
    moment(date).format("MMMM D, YYYY") + STRINGS.SITE_NAME_WITH_DIVIDER;
  if (sectionTitle) {
    results = sectionTitle + STRINGS.PAGE_TITLE_DIVIDER + results;
  }
  return results;
}

export function getDatePath(date, options = null, hash = null) {
  let path = STRINGS.ROUTE_ROOT + moment(date).format("YYYY/MM/DD");
  if (options) {
    path += "?" + queryString.stringify(options);
  }
  if (hash) {
    path += "#" + hash;
  }
  return path;
}

export function getMonthPath(date) {
  let path = STRINGS.ROUTE_ROOT + moment(date).format("YYYY/MM/");
  return path;
}
