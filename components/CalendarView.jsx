import {Calendar, momentLocalizer} from "react-big-calendar";
import Router, { withRouter } from "next/router";
import { STRINGS, getDatePath, getMonthPath } from "../helpers/constants";
import {
  fetchMetadata,
  getMonthEventsFromMetadata,
  isMonthInMetaData
} from "../helpers/papers";

import CalendarNotFoundComponent from "./components/CalendarNotFoundComponent";
import Link from "next/link";
import Loading from "./components/Loading";
import NotFound from "./NotFound";
import React from "react";
import moment from "moment";

const localizer = momentLocalizer(moment);

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, allPapers: [] };
  }

  async componentDidMount() {
    let yearString = this.props.router.query.year;
    let monthString = this.props.router.query.month;
    let thisMonth = moment({
      year: Number(yearString),
      month: Number(monthString) - 1
    });
    document.title = thisMonth.format("MMMM YYYY") + STRINGS.SITE_NAME_WITH_DIVIDER;

    let allPapers = await fetchMetadata();
    this.setState({allPapers, loading: false});
  }

  componentWillUnmount() {}

  render() {
    const { allPapers, loading } = this.state;
    if (loading) {
      return <Loading />;
    }

    let yearString = this.props.router.query.year;
    let monthString = this.props.router.query.month;
    let thisMonth = moment({
      year: Number(yearString),
      month: Number(monthString) - 1
    });
  

    if (!thisMonth.isValid()) {
      return <NotFound />;
    }

    let calendarNotFound = !isMonthInMetaData(allPapers, thisMonth);

    let allEvents = [];
    if (!calendarNotFound) {
      allEvents = allEvents.concat(
        getMonthEventsFromMetadata(
          allPapers,
          thisMonth.clone().subtract(1, "months")
        )
      );
      allEvents = allEvents.concat(
        getMonthEventsFromMetadata(allPapers, thisMonth.clone())
      );
      allEvents = allEvents.concat(
        getMonthEventsFromMetadata(
          allPapers,
          thisMonth.clone().add(1, "months")
        )
      );
    }

    return (
      <div className="CalendarMainView">
        <div className="CalendarTitle">
          <div className="CalendarTitleLeft">
            <span className="CalendarNavigationButton CalendarNavigationBackButton">
              <Link href={STRINGS.ROUTE_CALENDAR}>
                <a>View All Years</a></Link>
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
          <Calendar
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
                    href={getDatePath(event.start)}
                  >
                    <a>{event.title}</a>
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
    Router.push(getMonthPath(newDate));
  }
}

export default withRouter(CalendarView);