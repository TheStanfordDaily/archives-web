import { DEFAULTS_FORM_DATA } from "../pages/SearchView";

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

function createRangePath(year_start, year_end, pathSuffix) {
    for (let i of [100, 10]) {
        let nearest_start = roundUpToNearest(year_start, i);
        let nearest_end = roundDownToNearest(year_end + 1, i) - 1;
        if ((nearest_start !== year_start || nearest_end !== year_end) && nearest_start < nearest_end) {
            let first = createRangePath(year_start, nearest_start - 1, pathSuffix);
            let second = createRangePath(nearest_start, nearest_end, pathSuffix);
            let third = createRangePath(nearest_end + 1, year_end, pathSuffix);
            return [first, second, third].filter(e => e && e.trim()).join(" ");
        }
    }
    let paths = [];
    if ((year_end + 1 - year_start) % 100 === 0) {
        for (let year = year_start; year <= year_end; year += 100) {
            paths.push(createPath({century: String(year).substr(0, 2), pathSuffix}))
        }
    }
    else if ((year_end + 1 - year_start) % 10 === 0) {
        for (let year = year_start; year <= year_end; year += 10) {
            paths.push(createPath({decade: String(year).substr(0, 3), pathSuffix}))
        }
    }
    else {
        for (let year = year_start; year <= year_end; year += 1) {
            paths.push(createPath({year, pathSuffix}))
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
    else if (year_start && year_end
        // Don't create range for default range (all years):
        && (year_start !== DEFAULTS_FORM_DATA.year_start || year_end !== DEFAULTS_FORM_DATA.year_end) ) {
        path = createRangePath(year_start, year_end, pathSuffix);
    }
    else {
        path = createPath({ pathSuffix });
    }
    path = path.replace(/\/\*\/\*/g, "/*");
    let finalQuery = `${path} ${query}`;
    if (finalQuery.length > 250) {
        // Silently fail.
        finalQuery = finalQuery.substring(0, 250);
        // throw new Error("Queries can be up to 250 characters in length.");
    }
    return finalQuery;
}