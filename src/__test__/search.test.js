import { createSearchQuery } from "../helpers/search";

describe("createSearchQuery", () => {
    test("search query with text", () => {
        expect(createSearchQuery({query: "hi"})).toEqual("path:*.txt hi");
        expect(createSearchQuery({query: '"leland stanford"'})).toEqual('path:*.txt "leland stanford"');
    });
    test("search query with type", () => {
        expect(createSearchQuery({type: "article", query: "hi"})).toEqual("path:*.article.txt hi");
        expect(createSearchQuery({type: "advertisement", query: "hi"})).toEqual("path:*.advertisement.txt hi");
    });
    test("search query with dates", () => {
        expect(createSearchQuery({year: 1900, query: "hi"})).toEqual("path:/19xx/190x/1900y/*.txt hi");
        expect(createSearchQuery({year: 1900, month: 12, query: "hi"})).toEqual("path:/19xx/190x/1900y/12m/*.txt hi");
        expect(createSearchQuery({year: 1900, month: 12, day: 3, query: "hi"})).toEqual("path:/19xx/190x/1900y/12m/3d/*.txt hi");
    });
})