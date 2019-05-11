import parseXML from 'jquery';
import { STRINGS } from '../helpers/constants';

class Page {
  constructor(date, pageNumber, pageLabel, folderPath, altoFilePath, imageFilePath, sections) {
    this.date = date;
    // `pageNumber` is 1-based (because the filename convention).
    this.pageNumber = pageNumber;
    // From the attribute `ORDERLABEL=""` in "Physical Structure"
    this.pageLabel = pageLabel;

    this.folderPath = folderPath;
    this.altoFilePath = altoFilePath;
    this.imageFilePath = imageFilePath;

    // Format: [{type: "", title: "", sectionID: "", areaIDs: ["", ...]}, ...]
    this.sections = sections;
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
    const scaleFactor = 0.000299;

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

    for (let eachSection of this.sections) {
      let overlayIDs = eachSection.areaIDs;
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
    }

    let tileSource = {
      "@context": "http://iiif.io/api/image/2/context.json",
      "@id": imageURL,
      // TODO: different pages seem to have different height and width
      // See 1999-12-01 later pages (e.g. Stanford_Daily_19991201_0001_0001.jp2/info.json vs Stanford_Daily_19991201_0001_0064.jp2/info.json)
      // Can we simply use `/info.json` like before AND `overlays`?
      "height": 8471,
      "width": 5276,
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
