import parseXML from 'jquery';
import { STRINGS } from '../helpers/constants';
import fetch from "cross-fetch";

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

    this.sections = sections;
  }

  getAltoData() {
    if (this.altoData) {
      return new Promise((resolve, reject) => { resolve(this.altoData) });
    }

    return fetch(STRINGS.FILE_SERVER_URL + this.folderPath + this.altoFilePath)
      .then(e => e.text())
      .then(e => parseXML(e))
      .then(e => this.altoData = e)
      .then(e => this.altoData);
  }

  getBlockPositionAndSize(id) {
    // https://github.com/TheStanfordDaily/archives/issues/2#issuecomment-491546127
    let pageSize;
    if (this.pageSize) {
      pageSize = this.pageSize;
    } else {
      let pageTag = this.altoData.find("Page")[0];
      pageSize = {
        height: pageTag.attributes["HEIGHT"].nodeValue,
        width: pageTag.attributes["WIDTH"].nodeValue,
      };
      this.pageSize = pageSize;
    }
    const heightScaleFactor = pageSize.height / pageSize.width;

    // Find tag with `ID="{id}"`
    // https://stackoverflow.com/a/17268477/2603230
    let textBlock = this.altoData.find("[ID='" + id + "']")[0];
    let xPos = textBlock.attributes["hpos"].nodeValue / pageSize.width;
    let yPos = textBlock.attributes["vpos"].nodeValue / pageSize.height * heightScaleFactor;
    let width = textBlock.attributes["width"].nodeValue / pageSize.width;
    let height = textBlock.attributes["height"].nodeValue / pageSize.height * heightScaleFactor;
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
