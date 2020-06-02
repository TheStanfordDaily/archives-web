// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

export default function (input) {
    // let doc = new JSDOM(input);
    // return doc.window.document;
    return new DOMParser().parseFromString(input, "application/xml");
};