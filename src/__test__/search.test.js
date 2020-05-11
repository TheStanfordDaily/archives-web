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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article OR article_type:advertisement)"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)"`
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
      `"q.parser=lucene&q=article_text:test AND publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)"`
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
      `"q.parser=lucene&q=author:\\"Firstname Lastname\\" AND publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND title:\\"TitleWord1 TitleWord2\\" AND (article_type:article)"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND author_title:\\"AUTHOR_TITLE\\" AND (article_type:article)"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)&size=20"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)&size=20&start=400"`
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
      `"q.parser=lucene&q=publish_date:[1892-01-01T12:00:00Z TO 2015-01-02T12:00:00Z] AND (article_type:article)&highlight.article_text=%7Bformat:'html',max_phrases:5%7D"`
    );
  });
});
