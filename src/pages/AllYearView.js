import React from 'react';
import moment from 'moment'
import Loading from './components/Loading';
import { fetchMetadata, isMonthInMetaData } from '../helpers/papers';
import { STRINGS } from '../helpers/constants';

class AllYearView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, allPapers: [] };
  }

  async componentDidMount() {
    let allPapers = await fetchMetadata();
    this.setState({ allPapers: allPapers, loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      );
    }

    console.log(this.state.allPapers);

    const allYears = Object.keys(this.state.allPapers);

    console.log(allYears[0]);
    console.log(allYears[allYears.length - 1]);

    // https://stackoverflow.com/q/22876978/2603230
    let yearElements = [];
    for (let year = allYears[0]; year <= allYears[allYears.length - 1]; year++) {
      let monthsElements = [];
      for (let month = 0; month <= 11; month++) {
        let dateMoment = moment({ year: year, month: month });
        monthsElements.push(
          <div key={month} className="EachMonth">
            <span className={isMonthInMetaData(this.state.allPapers, dateMoment) ? "EachMonthLink" : "EachMonthNoLink"} onClick={() => { this.goToMonth(dateMoment); }}>
              {moment.monthsShort(month)}
            </span>
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
        <div className="AllYears">
          {yearElements}
        </div>
      </div>
    );
  }

  goToMonth(dateMoment) {
    if (isMonthInMetaData(this.state.allPapers, dateMoment)) {
      let yearString = dateMoment.format('YYYY');
      let monthString = dateMoment.format('MM');
      this.props.history.push(STRINGS.ROUTE_CALENDAR_PREFIX + yearString + "/" + monthString + "/");
    }
  }
}

export default AllYearView;
