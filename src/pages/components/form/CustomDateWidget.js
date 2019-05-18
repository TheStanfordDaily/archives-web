import AltDateWidget from 'react-jsonschema-form/lib/components/widgets/AltDateWidget';

// The default `AltDateWidget` does not pass back partial date.
// However, we want to partial date to work too.
export default class CustomDateWidget extends AltDateWidget {
  // Based on https://github.com/mozilla-services/react-jsonschema-form/blob/951aa580deb3d821bc0132b6837d86f9c1158764/src/components/widgets/AltDateWidget.js
  onChange = (property, value) => {
    this.setState(
      { [property]: typeof value === "undefined" ? -1 : value },
      () => {
        console.log(this.state);
        const resultYear = (this.state.year === -1) ? "????" : this.state.year;
        // https://stackoverflow.com/a/8513046/2603230
        const resultMonth = (this.state.month === -1) ? "??" : ('0' + this.state.month).slice(-2);
        const resultDay = (this.state.day === -1) ? "??" : ('0' + this.state.day).slice(-2);
        const resultFullDate = resultYear + "-" + resultMonth + "-" + resultDay;
        console.log(resultFullDate);
        this.props.onChange(resultFullDate);
      }
    );
  };

  componentWillReceiveProps(nextProps) {
    // Do nothing. If we don't include this, `AltDateWidget` will `parseDateString` which causes error.
  }
}
