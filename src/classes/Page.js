import parseXML from 'jquery';
import { STRINGS } from '../helpers/constants';

class Page {
  constructor(date, pageNumber, pageLabel, folderPath, altoFilePath, imageFilePath) {
    this.date = date;
    // `pageNumber` is 1-based (because the filename convention).
    this.pageNumber = pageNumber;
    // From the attribute `ORDERLABEL=""` in "Physical Structure"
    this.pageLabel = pageLabel;

    this.folderPath = folderPath;
    this.altoFilePath = altoFilePath;
    this.imageFilePath = imageFilePath;
  }

  async getAltoData() {
    if (this.altoData) {
      return this.altoData;
    }

    this.altoData = await fetch(STRINGS.FILE_SERVER_URL + this.folderPath + this.altoFilePath).then(e => e.text()).then(e => parseXML(e));
    return this.altoData;
  }

  getBlockPositionAndSize(id) {
    // Based on testing. See https://github.com/TheStanfordDaily/archives/issues/2#issuecomment-491481280.
    const scaleFactor = 0.0003;

    // Find tag with `ID="{id}"`
    // https://stackoverflow.com/a/17268477/2603230
    let textBlock = this.altoData.find("[ID='" + id + "']")[0];
    let xPos = textBlock.attributes["hpos"].nodeValue * scaleFactor;
    let yPos = textBlock.attributes["vpos"].nodeValue * scaleFactor;
    let width = textBlock.attributes["width"].nodeValue * scaleFactor;
    let height = textBlock.attributes["height"].nodeValue * scaleFactor;
    let results = {
      id: id,
      x: xPos,
      y: yPos,
      width: width,
      height: height
    };
    console.log(results);
    return results;
  }

  async getTileSource() {
    let imageURL = STRINGS.IMAGE_SERVER_URL + this.folderPath + this.imageFilePath;


    await this.getAltoData();

    let overlays = [];

    let overlayIDs = ["P1_TB00011", "P1_TB00012", "P1_TB00013", "P1_TB00014", "P1_TB00015", "P1_TB00016", "P1_TB00017", "P1_CB00002", "P1_TB00018"];
    for (let eachID of overlayIDs) {
      let overlayPos = this.getBlockPositionAndSize(eachID);
      let overlay = {
        // TODO: ADD `id`
        x: overlayPos.x,
        y: overlayPos.y,
        width: overlayPos.width,
        height: overlayPos.height,
        className: 'highlight'
      };
      overlays.push(overlay);
    }

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
