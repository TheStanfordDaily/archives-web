class Page {
  constructor(date, pageNumber, altoFilename, imageFilename) {
    this.date = date;
    this.pageNumber = pageNumber;
    this.altoFilename = altoFilename;
    this.imageFilename = imageFilename;
  }

  async getPage() {
    let results = await fetch('./test-alto.xml').then(e => new DOMParser().parseFromString(e, 'application/xml'));
    // await fetch('https://s3.amazonaws.com/stanforddailyarchive/' + this.altoFilename).then(e => new DOMParser().parseFromString(e, 'application/xml'));
    return results;
  }

  getTileSource() {
    return this.imageFilename + "/info.json";
  }
}

export default Page;
