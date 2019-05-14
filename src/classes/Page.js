import { STRINGS } from '../helpers/constants';
import fetch from "cross-fetch";
import parseXML from "../helpers/parseXML";
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

  getBlockText(id) {
    let textBlock = this.altoData.getElementById(id);
    let text = "";
    for (let line of textBlock.getElementsByTagName("textline")) {
      // console.log(line.id); // todo: use this to match with the text corrections we have.
      for (let word of line.getElementsByTagName("string")) {
        text += word.attributes["content"].value + " ";
      }
      text = text.slice(0, -1);
      text += "\n";
    }
    return text;
  }

  getSectionText(section) {
    let text = "";
    for (let id of section.areaIDs) {
     text += " " + this.getBlockText(id) + "\n";
    }
    text = text.slice(0, -1);
    return text;
  }

  getBlockPositionAndSize(id) {
    // https://github.com/TheStanfordDaily/archives/issues/2#issuecomment-491546127
    let pageSize;
    if (this.pageSize) {
      pageSize = this.pageSize;
    } else {
      let pageTag = this.altoData.getElementsByTagName("Page")[0];
      pageSize = {
        height: pageTag.getAttribute("HEIGHT"),
        width: pageTag.getAttribute("WIDTH"),
      };
      this.pageSize = pageSize;
    }
    const heightScaleFactor = pageSize.height / pageSize.width;

    let textBlock = this.altoData.getElementById(id);
    let xPos = textBlock.getAttribute("hpos") / pageSize.width;
    let yPos = textBlock.getAttribute("vpos") / pageSize.height * heightScaleFactor;
    let width = textBlock.getAttribute("width") / pageSize.width;
    let height = textBlock.getAttribute("height") / pageSize.height * heightScaleFactor;
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
