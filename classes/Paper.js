import Page from './Page';
import PageSection from './PageSection';
import { STRINGS } from '../helpers/constants';
import fetch from "cross-fetch";
import parseXML from "../helpers/parseXML";

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

    let altoFiles = xmlResults.querySelector("fileGrp[ID='ALTOGRP']").children;
    //console.log(altoFiles);
    for (var i = 0; i < altoFiles.length; i++) {
      let altoFileTag = altoFiles[i];
      let altoFileID = altoFileTag.getAttribute("ID");
      //console.log(altoFileID);

      let pageInfo = xmlResults.querySelector("structMap[TYPE='PHYSICAL'] area[FILEID='" + altoFileID + "']").parentElement.parentElement.parentElement;
      let pageNumber = Number(pageInfo.getAttribute("ORDER"));
      // Note that it seems `ALTO00001` does not have `LABEL="..."`, so we have to use `ORDERLABEL`.
      let pageLabel = pageInfo.getAttribute("ORDERLABEL") || pageNumber.toString();
      //console.log(pageNumber);
      //console.log(pageLabel);

      let altoFilename = altoFileTag.children[0].getAttribute("xlink:href");
      altoFilename = altoFilename.replace("file://./", "");
      //console.log(altoFilename);

      let imageFileTag = xmlResults.querySelector("fileGrp[ID='IMGGRP']").children[i];
      let imageFilename = imageFileTag.children[0].getAttribute("xlink:href");
      imageFilename = imageFilename.replace("file://./", "");
      //console.log(imageFilename);

      let sections = [];
      let typesSearched = ["ARTICLE", "ADVERTISEMENT"];

      let findSelectors = [];
      for (let eachType of typesSearched) {
        findSelectors.push("div[TYPE='" + eachType + "']");
      }
      let rawSectionsOnThisPage = xmlResults.querySelectorAll(findSelectors.join(","));
      for (let eachSection of rawSectionsOnThisPage) {
        if (!eachSection.querySelector("area[FILEID='" + altoFileID + "']")) {
          continue;
        }
        let type = eachSection.getAttribute("TYPE").toLowerCase();

        let sectionID = eachSection.getAttribute("ID");
        let dmdID = eachSection.getAttribute("DMDID");

        let title = eachSection.getAttribute("LABEL") || "Untitled";
        let subtitle = "";
        let author = "";
        if (dmdID) {
          let titleObjs = xmlResults.querySelector(`[ID=${dmdID}]`).getElementsByTagName("MODS:titleInfo");
          if (titleObjs.length >= 1) {
            title = titleObjs[0].textContent.trim() || "Untitled";
          }
          if (titleObjs.length >= 2) {
            for (let i = 1; i < titleObjs.length; i++) {
              subtitle += titleObjs[i].textContent.trim();
              if (i < (titleObjs.length - 1)) {
                subtitle += " ";
              }
            }
          }
          let authorObjs = xmlResults.querySelector(`[ID=${dmdID}]`).getElementsByTagName("MODS:namePart");
          if (authorObjs.length) {
            for (let i = 0; i < authorObjs.length; i++) {
              let authorObj = authorObjs[i];
              author += authorObj.textContent;
              if (i < (authorObjs.length - 1)) {
                author += " ";
              }
            }
          }
          sectionID = dmdID;
        }


        // We do `if` here because `LABEL` attribute could be "Untitled" too.
        if (title === "Untitled") {
          title = "Untitled " + type[0].toUpperCase() + type.slice(1); // Capitalize first letter
        }

        let areaIDs = {};
        let areaTypes = ["TITLE", "AUTHOR", "BODY"];
        for (let eachAreaType of areaTypes) {
          let rawAreas = eachSection.querySelectorAll("div[TYPE='" + eachAreaType + "'] area[FILEID='" + altoFileID + "']");
          areaIDs[eachAreaType] = [];
          for (let eachBodyArea of rawAreas) {
            areaIDs[eachAreaType].push(eachBodyArea.getAttribute("BEGIN"));
          }
        }

        let sectionInfo = new PageSection(type, title, subtitle, author, sectionID, areaIDs);
        //console.log(sectionInfo);

        sections.push(sectionInfo);
      }

      let eachPage = new Page(this.date, pageNumber, pageLabel, this.folderPath, altoFilename, imageFilename, sections);
      this.pages.push(eachPage);
    }

    return this.pages;
  }

  getPageNumberFromSectionID(sectionID) {
    for (let eachPage of this.pages) {
      for (let eachSection of eachPage.sections) {
        //console.log(eachSection.sectionID + " on " + eachPage.pageNumber.toString());
        if (eachSection.sectionID === sectionID) {
          return eachPage.pageNumber;
        }
      }
    }
    return -1;
  }
}

export default Paper;
