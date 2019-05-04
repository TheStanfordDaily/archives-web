import parseXML from 'jquery';
import { STRINGS } from '../helpers/constants';

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
    let results = await fetch(STRINGS.FILE_SERVER_URL + this.folderPath + this.altoFilePath).then(e => e.text()).then(e => parseXML(e));
    return results;
  }

  getTileSource() {
    return STRINGS.IMAGE_SERVER_URL + this.folderPath + this.imageFilePath + "/info.json";
  }
}

export default Page;
