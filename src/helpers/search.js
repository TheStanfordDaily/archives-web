
function createPath({century, decade, year, month, day, pathSuffix}) {
    let pathPrefix = "";
    if (century) {
        pathPrefix += `/${century}xx`;
    }
    if (decade) {
        pathPrefix += `/${decade}x`;
    }
    if (year) {
        pathPrefix += `/${year}y`;
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

/*
 * Rounds *i* to the nearest *n*.
 */
function roundToNearest(i, n) {
    return Math.round(i / n) * n;
}

export function createSearchQuery({year_start, year_end, year, month, day, type, query}) {
    let pathSuffix = "*.txt";
    if (type) {
        pathSuffix = `*.${type}.txt`;
    }
    let path;
    if (year) {
        path = createPath({century: String(year).substr(0, 2), decade: String(year).substr(0, 3), year, month, day, pathSuffix});
    }
    else if (year_start && year_end) {
        let paths = [];
        let nearest_start = roundToNearest(year_start, 100);
        let nearest_end = roundToNearest(year_end, 100);
        if (nearest_end - nearest_start === 100) {
            paths.push(
                createPath({century: String(nearest_start).substr(0, 2), pathSuffix})
            );
        }
        else {
            let nearest_start = roundToNearest(year_start, 10);
            let nearest_end = roundToNearest(year_end, 10);
            if (nearest_end - nearest_start === 10) {
                paths.push(
                    createPath({century: String(nearest_start).substr(0, 2), decade: String(nearest_start).substr(0, 3), pathSuffix})
                );
            }
        }
        path = paths.join(" ");
    }
    else {
        path = createPath({year, month, day, pathSuffix});
    }
    return `${path} ${query}`;
}