import { createCloudsearchQuery } from "../helpers/search";

describe("createCloudsearchQuery", () => {
  test("Empty Query, Error", () => {
    expect(createCloudsearchQuery({})).toMatchInlineSnapshot(`undefined`);
  });

  test("Query for everything (empty form query i.e. default values)", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        article_type_advertisement: true,
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%20OR%20article_type%3Aadvertisement%29&q.parser=lucene"`
    );
  });

  test("Query for all articles (empty form query i.e. default values)", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });

  test("Another way to query for all articles (empty form query i.e. default values)", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        article_type_advertisement: false,
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });

  test("Must include either article_type_article or article_type_advertisement", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
      })
    ).toMatchInlineSnapshot(`undefined`);
  });

  test("At least one of article_type_article or article_type_advertisement must be true", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: false,
        article_type_advertisement: false,
      })
    ).toMatchInlineSnapshot(`undefined`);
  });

  test("Search for article text", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        article_text: "test",
      })
    ).toMatchInlineSnapshot(
      `"q=article_text%3Atest%20AND%20publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });

  test("Search for author", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        author: "Firstname Lastname",
      })
    ).toMatchInlineSnapshot(
      `"q=author%3A%22Firstname%20Lastname%22%20AND%20publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });

  test("Search for title", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        title: "TitleWord1 TitleWord2",
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20title%3A%22TitleWord1%20TitleWord2%22%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });

  test("Search for author title", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        author_title: "AUTHOR_TITLE",
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20author_title%3A%22AUTHOR_TITLE%22%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });

  test("Search with results per page", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        resultsPerPage: 20,
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene&size=20"`
    );
  });

  test("Search starting at a page number", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        pageNumber: 20,
        resultsPerPage: 20,
      })
    ).toMatchInlineSnapshot(
      `"q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene&size=20&start=380"`
    );
  });

  test("Error starting at a page number without knowing reuslts per page", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        pageNumber: 20,
      })
    ).toMatchInlineSnapshot(`undefined`);
  });

  test("Search with highlights", () => {
    expect(
      createCloudsearchQuery({
        year_start: 1892,
        year_end: 2014,
        article_type_article: true,
        highlight: "article_text",
      })
    ).toMatchInlineSnapshot(
      `"highlight.article_text=%7Bformat%3A%27html%27%2Cmax_phrases%3A5%7D&q=publish_date%3A%5B1892-01-01T12%3A00%3A00Z%20TO%202015-01-02T12%3A00%3A00Z%5D%20AND%20%28article_type%3Aarticle%29&q.parser=lucene"`
    );
  });
});
