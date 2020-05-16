export default function (input) {
    let doc;
    if (typeof DOMParser === "undefined") {
        // Node js
        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        return new JSDOM(input).window.document;
    } else {
        // Browser
        return new DOMParser().parseFromString(input, "application/xml");
    }
};