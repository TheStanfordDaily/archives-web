import $ from 'jquery';

class Page {
  constructor(date, pageNumber, folderPath, altoFilePath, imageFilePath) {
    this.date = date;
    // `pageNumber` is 1-based (because the filename convention).
    this.pageNumber = pageNumber;
    this.folderPath = folderPath;
    this.altoFilePath = altoFilePath;
    this.imageFilePath = imageFilePath;
  }

  async getPage() {
    let results = await fetch('./test-alto.xml').then(e => e.text()).then(e => $.parseXML(e));
    // fetch('https://s3.amazonaws.com/stanforddailyarchive/' + this.folderPath + this.altoFilePath)
    return results;
  }

  getTileSource() {
    return "http://34.230.42.163:8888/s3:" + this.folderPath + this.imageFilePath + "/info.json";
  }
}

export default Page;
