import React from 'react';
import { Glyphicon } from 'react-bootstrap';

class CalendarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      gcalId: ''
    };
  }

  showDelete() {
    var gcalId = this.props.event.eventId;
    console.log('user gcal id', gcalId);
    this.setState({
      show: !this.state.show,
      gcalId: gcalId
    });
  }

  // handleDeleteEvent() {
  //   this.props.deleteEvent(this.state.gcalId);
  // }

  deleteEvent() {
    var token = localStorage.getItem('token');
    var deleteCalId = this.state.gcalId;
    var googleCalId = {eventId: deleteCalId};
    fetch('http://velocitydash.com/api/calendar/deleteEvent', {
      method: 'DELETE',
      body: JSON.stringify(googleCalId),
      mode: 'cors-with-forced-preflight',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
    .then(res => {
      if (res.status === 204) {
        this.props.fetch();
      }
    })
    .catch((err) => {
      console.log('did not delete event from db and gcal');
    });
  }


  render() {
    let displayButton = <span onClick={this.deleteEvent.bind(this)} className='glyphicon glyphicon-remove-circle' id='delete'></span>;

    return (
        <div className='calendar-entry'>
          <div className='event-start' onClick={this.showDelete.bind(this)}>
            {this.props.event.startTime}
            {this.state.show ? displayButton : null}
          </div>
          <div className='event-summary-location'>
            <a className='event-link' href={this.props.event.eventUrl} target='new'>{this.props.event.eventName} at {this.props.event.location}</a>
          </div>
        </div>
    );
  }
}

export default CalendarEntry;
