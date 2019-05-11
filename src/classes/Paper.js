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
      let altoFileID = altoFileTag.attributes["ID"].nodeValue;
      //console.log(altoFileID);

      let pageInfo = xmlResults.find("structMap[TYPE='PHYSICAL'] area[FILEID='" + altoFileID + "']").parent().parent().parent()[0];
      let pageNumber = Number(pageInfo.attributes["ORDER"].nodeValue);
      // Note that it seems `ALTO00001` does not have `LABEL="..."`, so we have to use `ORDERLABEL`.
      let pageLabel = pageInfo.attributes["ORDERLABEL"].nodeValue;
      //console.log(pageNumber);
      //console.log(pageLabel);

      let altoFilename = altoFileTag.children[0].attributes["xlink:href"].nodeValue;
      altoFilename = altoFilename.replace("file://./", "");
      //console.log(altoFilename);

      let imageFileTag = xmlResults.find("fileGrp[ID='IMGGRP']")[0].children[i];
      let imageFilename = imageFileTag.children[0].attributes["xlink:href"].nodeValue;
      imageFilename = imageFilename.replace("file://./", "");
      //console.log(imageFilename);

      let sections = [];
      let typesSearched = ["ARTICLE", "ADVERTISEMENT"];

      let findSelectors = [];
      for (let eachType of typesSearched) {
        findSelectors.push("div[TYPE='" + eachType + "']:has(area[FILEID='" + altoFileID + "'])");
      }
      let rawSectionsOnThisPage = xmlResults.find(findSelectors.join(","));
      //console.log(rawSectionsOnThisPage);
      for (let eachSection of rawSectionsOnThisPage) {
        let type = eachSection.attributes["TYPE"].nodeValue;
        //console.log(type);

        let title = eachSection.attributes["LABEL"] ? eachSection.attributes["LABEL"].nodeValue : "Untitled";
        //console.log(title);

        let areaIDs = [];
        let rawAreas = parseXML(eachSection).find("area[FILEID='" + altoFileID + "']");
        //console.log(rawAreas);
        for (let eachArea of rawAreas) {
          areaIDs.push(eachArea.attributes["BEGIN"].nodeValue);
        }
        //console.log(areaIDs);

        let sectionInfo = {
          type: type,
          title: title,
          areaIDs: areaIDs
        }
        //console.log(sectionInfo);

        sections.push(sectionInfo);
      }

      // `+1` because `pageNumber` is 1-based.
      let eachPage = new Page(this.date, pageNumber, pageLabel, this.folderPath, altoFilename, imageFilename, sections);
      this.pages.push(eachPage);
    }

    return this.pages;
  }
}

export default Paper;
