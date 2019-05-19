import React from 'react';

export default class Loading extends React.Component {
  render() {
    return (
      <div className="LoadingContainer">
        <div className="LoadingItem lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    );
  }
}
