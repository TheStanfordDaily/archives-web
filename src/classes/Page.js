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
    let imageURL = STRINGS.IMAGE_SERVER_URL + this.folderPath + this.imageFilePath;

    let overlays = [{
      // TODO: ADD `id`
      x: 1170 * 0.0003,
      y: 1085 * 0.0003,
      width: 485 * 0.0003,
      height: 1186 * 0.0003,
      className: 'highlight'
    }, {
      // TODO: ADD `id`
      x: 1695 * 0.0003,
      y: 970 * 0.0003,
      width: 491 * 0.0003,
      height: 1300 * 0.0003,
      className: 'highlight'
    }];

    let tileSource = {
      "@context": "http://iiif.io/api/image/2/context.json",
      "@id": imageURL,
      "height": 7200,
      "width": 5233,
      "profile": ["http://iiif.io/api/image/2/level2.json"],
      "protocol": "http://iiif.io/api/image",
      "tiles": [{
        "scaleFactors": [1, 2, 4, 8, 16, 32],
        "width": 1024
      }],
      "overlays": overlays,
    };
    return tileSource;
  }
}

export default Page;
