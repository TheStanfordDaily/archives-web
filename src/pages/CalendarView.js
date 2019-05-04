import React from 'react';

class CalendarView extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="NotFound">
        CalendarView{this.props.match.params.year}, {this.props.match.params.month}
      </div>
    );
  }
}

export default CalendarView;
