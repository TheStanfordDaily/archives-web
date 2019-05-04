import Paper from '../classes/Paper';
import { STRINGS } from '../helpers/constants';

export async function fetchPaper(year, month, day) {
  let allPapers = await fetch(STRINGS.FILE_SERVER_URL + "metadata.json").then(e => e.json());
  let fullFilePath = allPapers[year][month][day];
  if (!fullFilePath) {
    return null;
  }
  // https://stackoverflow.com/a/5555607/2603230
  var folderPath = fullFilePath.substring(0, fullFilePath.lastIndexOf("/") + 1);
  var metsFilePath = fullFilePath.substring(fullFilePath.lastIndexOf("/") + 1, fullFilePath.length);
  let paper = new Paper(Number(year), Number(month), Number(day), folderPath, metsFilePath);
  return paper;
}

export async function fetchAllPapers() {
  let allPapers = [];
  let results = await fetch(STRINGS.FILE_SERVER_URL + "metadata.json").then(e => e.json());
  //console.log(results);
  for (var year in results) {
    for (var month in results[year]) {
      for (var day in results[year][month]) {
        let fullFilePath = results[year][month][day];
        // https://stackoverflow.com/a/5555607/2603230
        var folderPath = fullFilePath.substring(0, fullFilePath.lastIndexOf("/") + 1);
        var metsFilePath = fullFilePath.substring(fullFilePath.lastIndexOf("/") + 1, fullFilePath.length);
        let paper = new Paper(Number(year), Number(month), Number(day), folderPath, metsFilePath);
        //console.log(fullFilePath);
        allPapers.push(paper);
      }
    }
  }
  console.log(allPapers);
  return allPapers;
}
