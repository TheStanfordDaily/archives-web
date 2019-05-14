class PageSection {
  constructor(type, title, subtitle, sectionID, areaIDs) {
    // The argument monthIndex is 0-based. Hence the `-1`.
    this.type = type;
    this.title = title;
    this.subtitle = subtitle;
    this.sectionID = sectionID;
    this.areaIDs = areaIDs;
  }

}

export default PageSection;
