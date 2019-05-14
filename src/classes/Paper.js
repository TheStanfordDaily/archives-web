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
          let titleObjs = xmlResults.getElementById(dmdID).getElementsByTagName("MODS:titleInfo");
          if (titleObjs.length >= 1) {
            title = titleObjs[0].textContent.trim() || "Untitled";
          }
          if (titleObjs.length >= 2) {
            for (let i = 1; i < titleObjs.length; i++) {
              subtitle += titleObjs[i].textContent.trim() + " ";
            }
          }
          let authorObjs = xmlResults.getElementById(dmdID).getElementsByTagName("MODS:namePart");
          if (authorObjs.length) {
            for (let authorObj of authorObjs) {
              author += authorObj.textContent + " ";
            }
          }
          sectionID = dmdID;
        }
        
        
        // We do `if` here because `LABEL` attribute could be "Untitled" too.
        if (title === "Untitled") {
          title = "Untitled " + type[0].toUpperCase() + type.slice(1); // Capitalize first letter
        }

        let areaIDs = [];
        let rawAreas = eachSection.querySelectorAll("div[TYPE='BODY'] area[FILEID='" + altoFileID + "']");
        //console.log(rawAreas);
        for (let eachArea of rawAreas) {
          areaIDs.push(eachArea.getAttribute("BEGIN"));
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
}

export default Paper;
