import parseXML from 'jquery';
import Page from './Page';
import { STRINGS } from '../helpers/constants';

class Paper {
  constructor(year, month, day, folderPath, metsFilePath) {
    // The argument monthIndex is 0-based. Hence the `-1`.
    this.date = new Date(year, month - 1, day);
    this.folderPath = folderPath;
    this.metsFilePath = metsFilePath;
  }

  async getPages() {
    if (this.pages) {
      return this.pages;
    }

    this.pages = [];

    let xmlResults = await fetch(STRINGS.FILE_SERVER_URL + this.folderPath + this.metsFilePath).then(e => e.text()).then(e => parseXML(e));

    let altoFiles = xmlResults.find("fileGrp[ID='ALTOGRP']")[0].children;
    //console.log(altoFiles);
    for (var i = 0; i < altoFiles.length; i++) {
      let altoFileTag = altoFiles[i];
      let altoFilename = altoFileTag.children[0].attributes["xlink:href"].nodeValue;
      altoFilename = altoFilename.replace("file://./", "");
      console.log(altoFilename);

      let imageFileTag = xmlResults.find("fileGrp[ID='IMGGRP']")[0].children[i];
      let imageFilename = imageFileTag.children[0].attributes["xlink:href"].nodeValue;
      imageFilename = imageFilename.replace("file://./", "");
      console.log(imageFilename);

      // `+1` because `pageNumber` is 1-based.
      let eachPage = new Page(this.date, i + 1, this.folderPath, altoFilename, imageFilename);
      this.pages.push(eachPage);
    }

    return this.pages;
  }
}

export default Paper;
