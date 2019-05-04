import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import NotFound from './NotFound';
import CalendarToolbar from './components/CalendarToolbar';
import { fetchMetadata, fetchPapersByYear, getMonthEventsFromMetadata } from '../helpers/papers';

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { calendarNotFound: false, allPapers: [], allEvents: [], currentMonth: null };
  }

  async componentDidMount() {
    let allPapers = await fetchMetadata();
    this.setState({ allPapers: allPapers });

    let yearString = this.props.match.params.year;
    let monthString = this.props.match.params.month;
    let thisMonth = moment({ year: Number(yearString), month: Number(monthString) - 1 });
    this.setState({currentMonth: thisMonth});
    this.setPaperMonth();

    if (!this.props.match.params.month) {
      let yearData = await fetchPapersByYear(this.props.match.params.year);
      console.log(yearData);
      if (yearData === null) {
        this.setState({ calendarNotFound: true });
      }
    }
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.calendarNotFound) {
      return (
        <NotFound />
      );
    }
    return (
      <div className="CalendarView">
        CalendarView{this.props.match.params.year}, {this.props.match.params.month}
        <div>
          <BigCalendar
            localizer={localizer}
            events={this.state.allEvents}
            defaultDate={new Date(Number(this.props.match.params.year), Number(this.props.match.params.month) - 1)}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event, e) => this.paperOnSelect(event, e)}
            views={[ "month" ]}
            components={{ toolbar: CalendarToolbar([ (op) => this.setPaperMonth(op) ]) }}
            style={{ "height": 500 }}
          />
        </div>
      </div>
    );
  }

  paperOnSelect(event, e) {
    let selectedDate = event.start;
    let selectedDateString = moment(selectedDate).format('YYYY-MM-DD');
    console.log(selectedDateString);
    this.props.history.push('/paper/' + selectedDateString);
  }

  setPaperMonth(op = null) {
    let thisMonth = this.state.currentMonth.clone();

    // Default is just `this.state.currentMonth`.
    if (op !== null) {
      // Note that this.state.currentMonth is mutable, so `.add`/`.substract` directly would work.
      if (op === "NEXT") {
        thisMonth.add(1, "months");
      } else if (op === "PREV") {
        thisMonth.subtract(1, "months");
      }
      let yearString = thisMonth.format('YYYY');
      let monthString = thisMonth.format('MM');
      this.props.history.push("/calendar/" + yearString + "/" + monthString + "/");
    }

    let allEvents = [];
    allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone().subtract(1, "months")));
    allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone()));
    allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone().add(1, "months")));

    this.setState({ currentMonth: thisMonth, allEvents: allEvents });
  }
}

export default CalendarView;
