import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import NotFound from './NotFound'
import Loading from './components/Loading';
import CalendarNotFoundComponent from './components/CalendarNotFoundComponent';
import { fetchMetadata, isMonthInMetaData, getMonthEventsFromMetadata } from '../helpers/papers';
import { STRINGS } from '../helpers/constants'

import "./css/CalendarView.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, allPapers: [] };
  }

  async componentDidMount() {
    let allPapers = await fetchMetadata();
    this.setState({ allPapers: allPapers, loading: false });
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      );
    }

    let yearString = this.props.match.params.year;
    let monthString = this.props.match.params.month;
    let thisMonth = moment({ year: Number(yearString), month: Number(monthString) - 1 });

    if (!thisMonth.isValid()) {
      return (
        <NotFound />
      )
    }

    let calendarNotFound = !isMonthInMetaData(this.state.allPapers, thisMonth);

    let allEvents = [];
    if (!calendarNotFound) {
      allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone().subtract(1, "months")));
      allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone()));
      allEvents = allEvents.concat(getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone().add(1, "months")));
    }

    return (
      <div className="CalendarMainView">
        <div className="CalendarTitle">
          <button className="CalendarNavigationButton CalendarNavigationPrevButton" onClick={() => this.calendar.handleNavigate('PREV')}>Back</button>
          <button className="CalendarNavigationButton CalendarNavigationNextButton" onClick={() => this.calendar.handleNavigate('NEXT')}>Next</button>
          <h1>{thisMonth.format("MMMM YYYY")}</h1>
        </div>
        <div className="CalendarContent">
          <BigCalendar
            ref={(calendar) => { this.calendar = calendar; }}
            localizer={localizer}
            events={allEvents}
            date={new Date(thisMonth)}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event, e) => this.paperOnSelect(event, e)}
            views={{ month: true, notfound: CalendarNotFoundComponent }}
            view={calendarNotFound ? "notfound" : "month"}
            components={{ toolbar: () => { return <></> } }}
            onNavigate={(date) => {
              this.goToNewDate(date);
            }}
            onView={() => { }} // Do nothing (to suppress the warning)
            eventPropGetter={(event, start, end, isSelected) => {
              let style = {
                backgroundColor: "#544948",
                borderRadius: '0px',
                color: 'white',
                border: '0px',
                display: 'block'
              };
              return {
                style: style
              };
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
    this.props.history.push(STRINGS.ROUTE_PAPER_PREFIX + selectedDateString + "#page=1");
  }

  goToNewDate(newDate) {
    let newDateMoment = moment(newDate);
    let yearString = newDateMoment.format('YYYY');
    let monthString = newDateMoment.format('MM');
    this.props.history.push(STRINGS.ROUTE_CALENDAR_PREFIX + yearString + "/" + monthString + "/");
  }
}

export default CalendarView;
