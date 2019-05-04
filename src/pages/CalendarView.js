import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import NotFound from './NotFound';
import { fetchAllPapers, fetchPapersByYear } from '../helpers/papers';

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { calendarNotFound: false, allEvents: [] };
  }

  async componentDidMount() {
    let allEvents = [];

    let allPapers = await fetchAllPapers();
    //console.log(allPapers);
    for ( let eachPaper of allPapers ) {
      let eachEvent = {
        start: eachPaper.date,
        end: eachPaper.date,
        title: moment(eachPaper.date).format('YYYY-MM-DD')
      };
      allEvents.push(eachEvent);
    }
    //console.log(allEvents);
    this.setState({ allEvents: allEvents });


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
            defaultDate={new Date(1892, 10 - 1)}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event, e) => this.paperOnSelect(event, e)}
            views={[ "month" ]}
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
}

export default CalendarView;
