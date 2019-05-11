import React from 'react';
import MonthView from 'react-big-calendar/lib/Month'

// Ref: https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/customView.js
export default class CalendarNotFoundComponent extends React.Component {
  render() {
    return (
      <div><i>There are no issues in the collection for this month.</i></div>
    );
  }
}
CalendarNotFoundComponent.navigate = MonthView.navigate;
CalendarNotFoundComponent.title = MonthView.title;
