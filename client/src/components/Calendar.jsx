import React from 'react';
import CalendarListEntry from './CalendarListEntry.jsx';
const moment = require('moment');

class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   fetch('http://localhost:9000/api/calendar/addEvent')
  // }

  render() {
    console.log('cal props', this.props)
    return(
      <div className='Calendar'>
        Today's Events
        {this.props.events.map(event =>
          <CalendarListEntry event={event} />
        )}
      </div>
    )
  }
}

export default Calendar;
