
function createPath({ century, decade, year, pathSuffix }) {
    let pathPrefix = "";
    if (year) {
        pathPrefix += `${year}y/`;
    }
    else if (decade) {
        pathPrefix += `${decade}x/*/`;
    }
    else if (century) {
        pathPrefix += `${century}xx/*/`;
    }
    return `path:${pathPrefix}${pathSuffix}`;
}

function createRangePath(year_start, year_end, pathSuffix, remainingChars) {
    for (let i of [100, 10]) {
        let nearest_start = roundUpToNearest(year_start, i);
        let nearest_end = roundDownToNearest(year_end + 1, i) - 1;
        if ((nearest_start !== year_start || nearest_end !== year_end) && nearest_start < nearest_end) {
            let first = createRangePath(year_start, nearest_start - 1, pathSuffix, remainingChars/3.0);
            let second = createRangePath(nearest_start, nearest_end, pathSuffix, remainingChars/3.0);
            let third = createRangePath(nearest_end + 1, year_end, pathSuffix, remainingChars/3.0);
            return [first, second, third].filter(e => e && e.trim()).join(" ");
        }
    }
    let paths = [];
    if ((year_end + 1 - year_start) % 100 === 0) {
        for (let year = year_start; year <= year_end; year += 100) {
            let created = createPath({century: String(year).substr(0, 2), pathSuffix});
            if (created.length <= remainingChars) {
                paths.push(created);
                remainingChars.n -= created.length;
            }
        }
    }
    else if ((year_end + 1 - year_start) % 10 === 0) {
        for (let year = year_start; year <= year_end; year += 10) {
            let created = createPath({decade: String(year).substr(0, 3), pathSuffix});
            if (created.length <= remainingChars) {
                paths.push(created);
                remainingChars.n -= created.length;
            }
        }
    }
    else {
        for (let year = year_start; year <= year_end; year += 1) {
            let created = createPath({year, pathSuffix});
            if (created.length <= remainingChars) {
                paths.push(created);
                remainingChars.n -= created.length;
            }
        }
    }
    return paths.join(" ");
}

/*
 * Rounds *i* to the nearest *n*.
 */
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
    if (day) {
        pathSuffix = `${day}d/${pathSuffix}`;
    }
    if (month) {
        pathSuffix = `${month}m/${pathSuffix}`;
    }
    let path;
    if (year) {
        path = createPath({ year, pathSuffix });
    }
    else if (year_start && year_end) {
        var remainingChars = { n: 250 - query.length };
        path = createRangePath(year_start, year_end, pathSuffix, remainingChars);
    }
    else {
        path = createPath({ pathSuffix });
    }
    path = path.replace(/\/\*\/\*/g, "/*");
    console.log("original query");
    console.log(query);
    let finalQuery = `${path} ${query}`;
    console.log(finalQuery);
    if (finalQuery.length > 250) {
        throw new Error("Queries can be up to 250 characters in length.");
    }
    return finalQuery;
}