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

  getAltoData() {
    if (this.altoData) {
      return new Promise((resolve, reject) => { resolve(this.altoData) });
    }

    return fetch(STRINGS.FILE_SERVER_URL + this.folderPath + this.altoFilePath)
      .then(e => e.text())
      .then(e => parseXML(e))
      .then(e => this.altoData = e);
  }

  getBlockPositionAndSize(id) {
    // Based on testing. See https://github.com/TheStanfordDaily/archives/issues/2#issuecomment-491481280.
    // TODO: This factor seems to be wrong for certain pages. See 1999-12-01#page=64 as an example.
    // Maybe need to with respect to the width/height?
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
    return results;
  }

  getTileSource() {
    return STRINGS.IMAGE_SERVER_URL + this.folderPath + this.imageFilePath + "/info.json";
  }
}

export default Page;
