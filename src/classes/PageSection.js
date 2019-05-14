class PageSection {
  constructor(type, title, subtitle, author, sectionID, areaIDs) {
    // The argument monthIndex is 0-based. Hence the `-1`.
    this.type = type;
    this.title = title;
    this.subtitle = subtitle;
    this.sectionID = sectionID;
    this.areaIDs = areaIDs;
    this.author = author;
  }

}

export default PageSection;
