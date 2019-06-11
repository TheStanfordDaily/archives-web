import { createSearchQuery } from "../helpers/search";

describe("createSearchQuery", () => {
  test("search query too long - length exception", () => {
    expect(createSearchQuery({ query: "12345678901234567890123451234567890123456789012345123456789012345678901234512345678901234567890123451234567890123456789012345123456789012345678901234512345678901234567890123451234567890123456789012345123456789012345678901234512345678901234567890123451" })).toThrowError("Queries can be up to 250 characters in length.");
  });
  test("search query with text", () => {
    expect(createSearchQuery({ query: "hi" })).toMatchInlineSnapshot(
      `"path:*.txt hi"`
    );
    expect(
      createSearchQuery({ query: '"leland stanford"' })
    ).toMatchInlineSnapshot(`"path:*.txt \\"leland stanford\\""`);
  });
  test("search query with type", () => {
    expect(
      createSearchQuery({ type: "article", query: "hi" })
    ).toMatchInlineSnapshot(`"path:*.article.txt hi"`);
    expect(
      createSearchQuery({ type: "advertisement", query: "hi" })
    ).toMatchInlineSnapshot(`"path:*.advertisement.txt hi"`);
  });
  test("search query with dates", () => {
    expect(
      createSearchQuery({ year: 1900, query: "hi" })
    ).toMatchInlineSnapshot(`"path:1900y/*.txt hi"`);
    expect(
      createSearchQuery({ year: 1900, month: 12, query: "hi" })
    ).toMatchInlineSnapshot(`"path:1900y/12m/*.txt hi"`);
    expect(
      createSearchQuery({ year: 1900, month: 12, day: 3, query: "hi" })
    ).toMatchInlineSnapshot(`"path:1900y/12m/3d/*.txt hi"`);
  });
  describe("search query with a single date range", () => {
    test("century", () => {
      expect(
        createSearchQuery({ year_start: 1900, year_end: 1999, query: "hi" })
      ).toMatchInlineSnapshot(`"path:19xx/*.txt hi"`);
    });
    test("decade", () => {
      expect(
        createSearchQuery({ year_start: 1900, year_end: 1909, query: "hi" })
      ).toMatchInlineSnapshot(`"path:190x/*.txt hi"`);
    });
  });
  describe("date ranges with months / days", () => {
    test("century with month", () => {
      expect(
        createSearchQuery({
          year_start: 1900,
          year_end: 1999,
          month: 10,
          query: "hi"
        })
      ).toMatchInlineSnapshot(`"path:19xx/*/10m/*.txt hi"`);
    });
    test("century with day", () => {
      expect(
        createSearchQuery({
          year_start: 1900,
          year_end: 1999,
          day: 15,
          query: "hi"
        })
      ).toMatchInlineSnapshot(`"path:19xx/*/15d/*.txt hi"`);
    });
    test("century with month + day", () => {
      expect(
        createSearchQuery({
          year_start: 1900,
          year_end: 1999,
          month: 10,
          day: 15,
          query: "hi"
        })
      ).toMatchInlineSnapshot(`"path:19xx/*/10m/15d/*.txt hi"`);
    });
  });
  describe("search query with combinations of date ranges", () => {
    test("two centuries", () => {
      expect(
        createSearchQuery({ year_start: 1800, year_end: 1999, query: "hi" })
      ).toMatchInlineSnapshot(`"path:18xx/*.txt path:19xx/*.txt hi"`);
    });
    test("two decades", () => {
      expect(
        createSearchQuery({ year_start: 1900, year_end: 1919, query: "hi" })
      ).toMatchInlineSnapshot(`"path:190x/*.txt path:191x/*.txt hi"`);
    });
    test("century + decade", () => {
      expect(
        createSearchQuery({ year_start: 1900, year_end: 2009, query: "hi" })
      ).toMatchInlineSnapshot(`"path:19xx/*.txt path:200x/*.txt hi"`);
      expect(
        createSearchQuery({ year_start: 1900, year_end: 2019, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:19xx/*.txt path:200x/*.txt path:201x/*.txt hi"`
      );
    });
    test("decade + century", () => {
      expect(
        createSearchQuery({ year_start: 1890, year_end: 1999, query: "hi" })
      ).toMatchInlineSnapshot(`"path:189x/*.txt path:19xx/*.txt hi"`);
      expect(
        createSearchQuery({ year_start: 1880, year_end: 1999, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:188x/*.txt path:189x/*.txt path:19xx/*.txt hi"`
      );
    });
    test("decade + century + decade", () => {
      expect(
        createSearchQuery({ year_start: 1890, year_end: 2009, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:189x/*.txt path:19xx/*.txt path:200x/*.txt hi"`
      );
      expect(
        createSearchQuery({ year_start: 1880, year_end: 2019, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:188x/*.txt path:189x/*.txt path:19xx/*.txt path:200x/*.txt path:201x/*.txt hi"`
      );
    });
  });
  // console.error(year_start, year_end, nearest_start, nearest_end);
  describe("search query with a date range with single years", () => {
    test("year + year + year", () => {
      expect(
        createSearchQuery({ year_start: 1900, year_end: 1902, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:1900y/*.txt path:1901y/*.txt path:1902y/*.txt hi"`
      );
    });
    test("year + decade", () => {
      expect(
        createSearchQuery({ year_start: 1909, year_end: 1919, query: "hi" })
      ).toMatchInlineSnapshot(`"path:1909y/*.txt path:191x/*.txt hi"`);
    });
    test("decade + year", () => {});
    test("year + decade + year", () => {});
    test("year + century", () => {});
    test("century + year", () => {});
    test("year + century + year", () => {});
    test("century + decade + year", () => {});
    test("year + century + decade", () => {});
    test("year with NOT", () => {
      expect(
        createSearchQuery({ year_start: 1906, year_end: 1914, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:1906y/*.txt path:1907y/*.txt path:1908y/*.txt path:1909y/*.txt path:1910y/*.txt path:1911y/*.txt path:1912y/*.txt path:1913y/*.txt path:1914y/*.txt hi"`
      );
      expect(
        createSearchQuery({ year_start: 1900, year_end: 1908, query: "hi" })
      ).toMatchInlineSnapshot(
        `"path:1900y/*.txt path:1901y/*.txt path:1902y/*.txt path:1903y/*.txt path:1904y/*.txt path:1905y/*.txt path:1906y/*.txt path:1907y/*.txt path:1908y/*.txt hi"`
      );
      // expect(createSearchQuery({year_start: 1900, year_end: 1908, query: "hi"})).toMatchInlineSnapshot();
    });
  });
  test("search query with combinations of date ranges with single years", () => {
    expect(
      createSearchQuery({ year_start: 1900, year_end: 1920, query: "hi" })
    ).toMatchInlineSnapshot(
      `"path:190x/*.txt path:191x/*.txt path:1920y/*.txt hi"`
    );
  });
});
