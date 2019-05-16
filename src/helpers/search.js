
function createPath({century, decade, year, month, day, pathSuffix}) {
    let pathPrefix = "";
    if (year) {
        pathPrefix += `/${century}xx/${decade}x/${year}y`;
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
    return `path:${pathPrefix}${pathSuffix}`;
}

export function createSearchQuery({year_start, year_end, year, month, day, type, query}) {
    let pathSuffix = "*.txt";
    if (type) {
        pathSuffix = `*.${type}.txt`;
    }
    let path = createPath({century: String(year).substr(0, 2), decade: String(year).substr(0, 3), year, month, day, pathSuffix});
    return `${path} ${query}`;
}