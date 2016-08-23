import React from 'react';
import CalendarEntry from './CalendarEntry.jsx';
import { Glyphicon, Overlay } from 'react-bootstrap';


class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment().format('dddd, MMMM D'),
    };
  }

  render() {
    return (
      <div className='calendar'>
        <div className='calendar-title'>
          {this.state.date}
        </div>
        <div>
        {this.props.events.map((event, i) =>
<<<<<<< 006f746812a22ab38008e63d3518725e5953153d
          <CalendarEntry fetch={this.props.fetch} key={i} event={event} />
          )}
=======
            <CalendarEntry deleteEvent={this.props.deleteEvent} key={i} event={event} />
        )}
>>>>>>> mouse over event on each cal event and able to send gcal id to main app component
        </div>
      </div>
    );
  }
}

export default Calendar;

        // <div className='add-event-glyph'><Glyphicon glyph="plus" />
        // </div>

// maybe make the add-event-glyph into load more calendar events, or can add an event from clicking on it, not sure which is more intuitive
