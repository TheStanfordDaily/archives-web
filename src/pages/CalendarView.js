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
    this.state = { calendarNotFound: false, allPapers: [], currentMonth: null };
  }

  async componentDidMount() {
    this.updateCurrentMonth();

    let allPapers = await fetchMetadata();
    this.setState({ allPapers: allPapers });

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

  componentDidUpdate(prevProps) {
    if (this.props.match.params.year !== prevProps.match.params.year ||
      this.props.match.params.month !== prevProps.match.params.month) {
      this.updateCurrentMonth();
    }
  }

  updateCurrentMonth() {
    let yearString = this.props.match.params.year;
    let monthString = this.props.match.params.month;
    let thisMonth = moment({ year: Number(yearString), month: Number(monthString) - 1 });
    this.setState({ currentMonth: thisMonth });
  }

  render() {
    if (this.state.calendarNotFound) {
      return (
        <NotFound />
      );
    }

    if (this.state.allPapers.length === 0 || this.state.currentMonth === null) {
      return (
        <div>Loading...</div>
      );
    }

    let allEvents = [];
    allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, this.state.currentMonth.clone().subtract(1, "months")));
    allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, this.state.currentMonth.clone()));
    allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, this.state.currentMonth.clone().add(1, "months")));
    return (
      <div className="CalendarView">
        CalendarView{this.props.match.params.year}, {this.props.match.params.month}
        <div>
          <BigCalendar
            localizer={localizer}
            events={allEvents}
            date={new Date(this.state.currentMonth)}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event, e) => this.paperOnSelect(event, e)}
            views={[ "month" ]}
            components={{ toolbar: CalendarToolbar }}
            style={{ "height": 500 }}
            onNavigate={(date) => {
              this.goToNewDate(date);
            }}
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

  goToNewDate(newDate) {
    let newDateMoment = moment(newDate);
    let yearString = newDateMoment.format('YYYY');
    let monthString = newDateMoment.format('MM');
    this.props.history.push("/calendar/" + yearString + "/" + monthString + "/");
  }
}

export default CalendarView;
