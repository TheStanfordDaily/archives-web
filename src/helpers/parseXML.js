const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export default function (input) {
    let doc = new JSDOM(input);
    return doc.window.document;
};