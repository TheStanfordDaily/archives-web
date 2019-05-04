import Paper from '../classes/Paper';
import { STRINGS } from '../helpers/constants';

async function fetchMetadata() {
  let allPapers = await fetch(STRINGS.FILE_SERVER_URL + "metadata.json").then(e => e.json());
  return allPapers;
}

function createPaperFrom(year, month, day, fullFilePath) {
  // https://stackoverflow.com/a/5555607/2603230
  var folderPath = fullFilePath.substring(0, fullFilePath.lastIndexOf("/") + 1);
  var metsFilePath = fullFilePath.substring(fullFilePath.lastIndexOf("/") + 1, fullFilePath.length);
  let paper = new Paper(Number(year), Number(month), Number(day), folderPath, metsFilePath);
  return paper;
}

export async function fetchPaper(year, month, day) {
  let allPapers = await fetchMetadata();

  // TODO: Better way to check it?
  if (allPapers[year] === undefined || allPapers[year][month] === undefined || allPapers[year][month][day] === undefined) {
    return null;
  }

  let fullFilePath = allPapers[year][month][day];
  if (!fullFilePath) {
    return null;
  }

  return createPaperFrom(year, month, day, fullFilePath);
}

export async function fetchPapersByYear(year) {
  let allPapers = await fetchMetadata();
  let yearData = allPapers[year];
  if (!yearData) {
    return null;
  }

  return yearData;
}

export async function fetchAllPapers() {
  let allPapers = await fetchMetadata();
  //console.log(allPapers);

  let results = [];
  for (var year in allPapers) {
    for (var month in allPapers[year]) {
      for (var day in allPapers[year][month]) {
        let fullFilePath = allPapers[year][month][day];
        //console.log(fullFilePath);
        let paper = createPaperFrom(year, month, day, fullFilePath);
        results.push(paper);
      }
    }
  }
  console.log(results);
  return results;
}
