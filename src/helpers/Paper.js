import Page from './Page';

class Paper {
  constructor(year, month, day, metsFile) {
    // The argument monthIndex is 0-based. Hence the `-1`.
    this.date = new Date(year, month - 1, day);
    this.metsFile = metsFile;
  }

  async getPages() {
    if (this.pages) {
      return this.pages;
    }

    let xmlResults = await fetch('./test-mets.xml').then(e => e.text()).then(e => new DOMParser().parseFromString(e, 'application/xml'));
    // fetch('https://s3.amazonaws.com/stanforddailyarchive/' + this.metsFile).then(e => new DOMParser().parseFromString(e, 'application/xml'));

    this.pages = [];
    for (var i = 1; i <= 4; i++) {  // TODO: get actual data
      let imageURL = "http://34.230.42.163:8888/s3:data.2012-aug/data/stanford/1920/10/01_01/Stanford_Daily-IMG/Stanford_Daily_19201001_0001_000" + i.toString() + ".jp2";
      let eachPage = new Page(this.date, i, "./a.xml", imageURL);
      this.pages.push(eachPage);
    }

    return this.pages;
  }
}

export default Paper;
