export function createSearchQuery({year_start, year_end, year, month, day, type, query}) {
    let pathSuffix = "*.txt";
    if (type) {
        pathSuffix = `*.${type}.txt`;
    }
    let pathPrefix = "";
    if (year) {
        pathPrefix += `/${String(year).substr(0, 2)}xx/${String(year).substr(0, 3)}x/${year}y`;
    }
    if (month) {
        pathPrefix += `/${month}m`;
    }
    if (day) {
        pathPrefix += `/${day}d`;
    }
    if (pathPrefix) {
        pathPrefix += "/";
    }
    return `path:${pathPrefix}${pathSuffix} ${query}`;
}