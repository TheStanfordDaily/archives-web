import React from 'react';

export default class Loading extends React.Component {
  render() {
    const containerClasses = this.props.containerClasses ? (" " + this.props.containerClasses) : "";

    return (
      <div className={"LoadingContainer" + containerClasses}>
        <div className="LoadingItem lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    );
  }
}
