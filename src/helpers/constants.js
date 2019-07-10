import moment from "moment";
import queryString from "query-string";

export const STRINGS = {
  PAGE_TITLE_DIVIDER: " - ",
  SITE_NAME: "The Stanford Daily Archives",
  SITE_NAME_WITH_DIVIDER: " - Stanford Daily Archives",
  FILE_SERVER_URL: "https://tiles.archives.stanforddaily.com/",
  IMAGE_SERVER_URL: "https://tiles.archives.stanforddaily.com/",
  SEARCH_SERVER_URL: "https://api.bitbucket.org/2.0/teams/%7B34f1ce51-8a37-4436-9c9c-dc71cb82f5d6%7D/search/code",
  SECTION_CONTENT_SERVER_URL: "https://raw.githubusercontent.com/TheStanfordDaily/archives-text/master/",
  ROUTE_ROOT: "/",
  ROUTE_CALENDAR: "/calendar",
  ROUTE_ACKNOWLEDGEMENTS: "/acknowledgements",
  ROUTE_SEARCH_PREFIX: "/search",
  GOOGLE_ANALYTICS_TRACKING_ID: "UA-5773957-6",
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

export function getDatePath(date, options = null) {
  let path = STRINGS.ROUTE_ROOT + moment(date).format("YYYY/MM/DD");
  if (options) {
    path += "?" + queryString.stringify(options);
  }
  return path;
}

export function getMonthPath(date) {
  let path = STRINGS.ROUTE_ROOT + moment(date).format("YYYY/MM/");
  return path;
}
