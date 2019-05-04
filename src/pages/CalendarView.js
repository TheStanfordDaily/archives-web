import React from 'react';
import NotFound from './NotFound';
import { fetchPapersByYear } from '../helpers/papers';

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { calendarNotFound: false };
  }

  async componentDidMount() {
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
      </div>
    );
  }
}

export default CalendarView;
