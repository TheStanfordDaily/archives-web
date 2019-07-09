import React from "react";
import { Link } from "react-router-dom";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import NotFound from "./NotFound";
import Loading from "./components/Loading";
import CalendarNotFoundComponent from "./components/CalendarNotFoundComponent";
import {
  fetchMetadata,
  isMonthInMetaData,
  getMonthEventsFromMetadata
} from "../helpers/papers";
import { STRINGS, getDatePath, getMonthPath } from "../helpers/constants";

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

  componentWillUnmount() {}

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    let yearString = this.props.match.params.year;
    let monthString = this.props.match.params.month;
    let thisMonth = moment({
      year: Number(yearString),
      month: Number(monthString) - 1
    });

    document.title =
      thisMonth.format("MMMM YYYY") + STRINGS.SITE_NAME_WITH_DIVIDER;

    if (!thisMonth.isValid()) {
      return <NotFound />;
    }

    let calendarNotFound = !isMonthInMetaData(this.state.allPapers, thisMonth);

    let allEvents = [];
    if (!calendarNotFound) {
      allEvents = allEvents.concat(
        getMonthEventsFromMetadata(
          this.state.allPapers,
          thisMonth.clone().subtract(1, "months")
        )
      );
      allEvents = allEvents.concat(
        getMonthEventsFromMetadata(this.state.allPapers, thisMonth.clone())
      );
      allEvents = allEvents.concat(
        getMonthEventsFromMetadata(
          this.state.allPapers,
          thisMonth.clone().add(1, "months")
        )
      );
    }

    return (
      <div className="CalendarMainView">
        <div className="CalendarTitle">
          <div className="CalendarTitleLeft">
            <span className="CalendarNavigationButton CalendarNavigationBackButton">
              <Link to={STRINGS.ROUTE_CALENDAR}>View All Years</Link>
            </span>
          </div>
          <div className="CalendarTitleCenter">
            <button
              className="CalendarNavigationButton CalendarNavigationPrevButton"
              onClick={() => this.calendar.handleNavigate("PREV")}
            />
            <h1>{thisMonth.format("MMMM YYYY")}</h1>
            <button
              className="CalendarNavigationButton CalendarNavigationNextButton"
              onClick={() => this.calendar.handleNavigate("NEXT")}
            />
          </div>
          <div className="CalendarTitleRight">{/* Nothing here yet. */}</div>
        </div>
        <div className="CalendarContent">
          <BigCalendar
            ref={calendar => {
              this.calendar = calendar;
            }}
            localizer={localizer}
            events={allEvents}
            date={new Date(thisMonth)}
            startAccessor="start"
            endAccessor="end"
            views={{ month: true, notfound: CalendarNotFoundComponent }}
            view={calendarNotFound ? "notfound" : "month"}
            components={{
              event: ({ event }) => {
                return (
                  <Link
                    to={getDatePath(event.start)}
                    title={moment(event.start).format("MMMM D, YYYY")}
                  >
                    {event.title}
                  </Link>
                );
              },
              toolbar: () => {
                return <></>;
              }
            }}
            onNavigate={date => {
              this.goToNewDate(date);
            }}
            onView={() => {}} // Do nothing (to suppress the warning)
            eventPropGetter={(event, start, end, isSelected) => {
              return {
                className: "CalendarContentEvent"
              };
            }}
          />
        </div>
      </div>
    );
  }

  goToNewDate(newDate) {
    this.props.history.push(getMonthPath(newDate));
  }
}

export default CalendarView;
