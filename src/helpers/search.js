
function createPath({ century, decade, year, month, day, pathSuffix }) {
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
function roundDownToNearest(i, n) {
    return Math.floor(i / n) * n;
}
function roundUpToNearest(i, n) {
    return Math.ceil(i / n) * n;
}

export function createSearchQuery({ year_start, year_end, year, month, day, type, query }) {
    let pathSuffix = "*.txt";
    if (type) {
        pathSuffix = `*.${type}.txt`;
    }
    let path;
    if (year) {
        path = createPath({ century: String(year).substr(0, 2), decade: String(year).substr(0, 3), year, month, day, pathSuffix });
    }
    else if (year_start && year_end) {
        let paths = [];
        let nearest_start, nearest_end;

        nearest_start = roundToNearest(year_start, 10);
        nearest_end = roundDownToNearest(roundDownToNearest(year_end + 1, 100) + 1, 10);
        // console.error(year_start, year_end, nearest_start, nearest_end);
        if (nearest_end - nearest_start > 0) {
            for (; nearest_start < nearest_end && (nearest_end - nearest_start) % 100 !== 0; nearest_start += 10) {
                paths.push(
                    createPath({ century: String(nearest_start).substr(0, 2), decade: String(nearest_start).substr(0, 3), pathSuffix })
                );
            }
            year_start = nearest_start;
        }
        
        nearest_start = roundToNearest(year_start, 100);
        nearest_end = roundDownToNearest(year_end + 1, 100);
        // console.error(year_start, year_end, nearest_start, nearest_end);
        if (nearest_end - nearest_start > 0) {
            for (; nearest_start < nearest_end; nearest_start += 100) {
                paths.push(
                    createPath({ century: String(nearest_start).substr(0, 2), pathSuffix })
                );
            }
            year_start = nearest_start;
        }

        nearest_start = roundToNearest(year_start, 10);
        nearest_end = roundDownToNearest(year_end + 1, 10);
        // console.error(year_start, year_end, nearest_start, nearest_end);
        if (nearest_end - nearest_start > 0) {
            for (; nearest_start < nearest_end && (nearest_end - nearest_start) % 100 !== 0; nearest_start += 10) {
                paths.push(
                    createPath({ century: String(nearest_start).substr(0, 2), decade: String(nearest_start).substr(0, 3), pathSuffix })
                );
            }
            year_start = nearest_start;
        }

        // if (year_end - year_start > 0) {
        //     for (; nearest_start < nearest_end; nearest_start++) {
        //         paths.push(
        //             createPath({ century: String(nearest_start).substr(0, 2), decade: String(nearest_start).substr(0, 3), year: String(nearest_start), pathSuffix })
        //         )
        //     }
        // }

        path = paths.join(" ");
    }
    else {
        path = createPath({ year, month, day, pathSuffix });
    }
    return `${path} ${query}`;
}