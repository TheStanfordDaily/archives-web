import React from "react";
import { Link } from "react-router-dom";
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
    this.setState({ allPapers: allPapers, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    console.log(this.state.allPapers);

    const allYears = Object.keys(this.state.allPapers);

    console.log(allYears[0]);
    console.log(allYears[allYears.length - 1]);

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
            {isMonthInMetaData(this.state.allPapers, dateMoment) ? (
              <Link
                to={getMonthPath(dateMoment)}
                title={dateMoment.format("MMMM YYYY")}
                className="EachMonthLink"
              >
                {moment.monthsShort(month)}
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
