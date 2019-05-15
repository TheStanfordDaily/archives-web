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
    test("search query with simple date range", () => {
        expect(createSearchQuery({year_start: 1900, year_end: 1999, query: "hi"})).toEqual("path:/19xx/*.txt hi");
        expect(createSearchQuery({year_start: 1900, year_end: 1909, query: "hi"})).toEqual("path:/19xx/190x/*.txt hi");
    });
    test("search query with complex date range", () => {
        expect(createSearchQuery({year_start: 1900, year_end: 2999, query: "hi"})).toEqual("path:/19xx/*.txt path:/20xx/*.txt hi");
        expect(createSearchQuery({year_start: 1900, year_end: 2009, query: "hi"})).toEqual("path:/19xx/*.txt path:/20xx/201x/*.txt hi");
        expect(createSearchQuery({year_start: 1900, year_end: 1919, query: "hi"})).toEqual("path:/19xx/190x/*.txt path:/19xx/191x/*.txt hi");
    });
    test("search query with complex date range with single years", () => {
        expect(createSearchQuery({year_start: 1900, year_end: 1920, query: "hi"})).toEqual("path:/19xx/190x/*.txt path:/19xx/191x/*.txt path:/19xx/192x/1920y/*.txt hi");
        expect(createSearchQuery({year_start: 1900, year_end: 1902, query: "hi"})).toEqual("path:/19xx/190x/1900y/*.txt path:/19xx/190x/1901y/*.txt path:/19xx/190x/1902y/*.txt hi");
        expect(createSearchQuery({year_start: 1900, year_end: 1908, query: "hi"})).toEqual("path:/19xx/190x/*.txt NOT path:/19xx/190x/1909y/*.txt hi");
    });
})