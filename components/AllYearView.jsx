import React from "react";
import Link from "next/link";
import moment from "moment";
import Loading from "./components/Loading";
import { fetchMetadata, isMonthInMetaData } from "../helpers/papers";
import { STRINGS, getMonthPath } from "../helpers/constants";

class AllYearView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, allPapers: [] };
  }

  async componentDidMount() {
    document.title = "Calendar" + STRINGS.SITE_NAME_WITH_DIVIDER;
    let allPapers = await fetchMetadata();
    this.setState({allPapers, loading: false});
  }

  render() {
    const { allPapers, loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    const allYears = Object.keys(allPapers);

    // https://stackoverflow.com/q/22876978/2603230
    let yearElements = [];
    for (
      let year = allYears[0];
      year <= allYears[allYears.length - 1];
      year++
    ) {
      let monthsElements = [];
      for (let month = 0; month <= 11; month++) {
        let dateMoment = moment({ year: year, month: month });
        monthsElements.push(
          <div key={month} className="EachMonth">
            {isMonthInMetaData(allPapers, dateMoment) ? (
              <Link
                href={getMonthPath(dateMoment)}
              >
                <a title={dateMoment.format("MMMM YYYY")}
                className="EachMonthLink">{moment.monthsShort(month)}</a>
              </Link>
            ) : (
              <span className="EachMonthNoLink">
                {moment.monthsShort(month)}
              </span>
            )}
          </div>
        );
      }
      yearElements.push(
        <div key={year} id={year} className="EachYear">
          <h2 className="YearName">{year}</h2>
          <div className="YearMonths">{monthsElements}</div>
        </div>
      );
    }

    return (
      <div className="AllYearMainView">
        <div className="AllYears">{yearElements}</div>
      </div>
    );
  }
}

export default AllYearView;
