import React from 'react';
import moment from 'moment';
var Modal = require('react-modal');

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summary: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      modalIsOpen: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    // Fill out calendar form with voice
    this.props.commands.onFillOutForm((formData) => {
      this.openModal();
      this.setState(formData);
    });

    // this.props.commands.onVoiceSubmit(() => {
    //   this.handleSubmit(e);
    // });

    // Set up commands
    this.props.commands.addCommands(this.props.commands.commands);

    // Start artyom listener
    this.props.commands.artyomStart();
  }

  // Update Form's state on input form change
  handleChange(e) {
    var className = e.target.className;
    var value = e.target.value;

    // TO DO: Change default event time to an hour, but need to change date as well if event goes past midnight (use MomentJS)

    if (className === 'form-event') {
      this.setState({
        summary: value
      });
    } else if (className === 'form-location') {
      this.setState({
        location: value
      });
    } else if (className === 'form-date') {
      this.setState({
        startDate: value,
        endDate: value
      });
    } else if (className === 'form-time') {
      this.setState({
        startTime: value,
        endTime: value
      });
    }
  }


  handleSubmit(e) {
    e.preventDefault();

    // TO DO: Use geolocation to update timeZone automatically

    // Create event object with Form's state
    var event = {
      summary: this.state.summary,
      location: this.state.location,
      start: {
        dateTime: `${this.state.startDate}T${this.state.startTime}:00-07:00`,
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: `${this.state.endDate}T${this.state.endTime}:00-07:00`,
        timeZone: 'America/Los_Angeles'
      }
    };

    // Clear state which the form's values are pointing to
    this.setState({
      summary: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    });

    var token = localStorage.getItem('token');
    console.log('got token for adding event', token);

    // Post event to Google Calendar API
    fetch('http://localhost:9000/api/calendar/addEvent', {
      method: 'POST',
      body: JSON.stringify(event),
      mode: 'cors-with-forced-preflight',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    }).then((res) => {
      console.log('res', res);
      return res.json();
    }).then((data) => {
      // Refreshes today's events in chronological order including new event that was just added
      this.props.refreshEvents();
    }).catch((err) => { console.log('Error posting event to Google Calendar:\n', err); });

    this.closeModal();
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    })
  }

  closeModal() {
    this.setState({
      modalIsOpen:false
    })
  }



  render() {
    return (
      <div>
      <div className='add-event' onClick={this.openModal}>
        Add event
      </div>
        <Modal
          className="ModalClass"
          overlayClassName="OverlayClass"
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <div>
            <form className="calendar-form" onSubmit={this.handleSubmit}>
              <div className="calendar-form-title"> How's this look? </div>
              <div>
                Event: <input type="text" className="form-event" value={this.state.summary} placeholder="Event" onChange={this.handleChange} />
              </div>
              <div>
                Location: <input type="text" className="form-location" value={this.state.location} placeholder="Location" onChange={this.handleChange} />
              </div>
              <div>
                Date: <input type="text" className="form-date" value={this.state.startDate} placeholder="Date" onChange={this.handleChange} />
              </div>
              <div>
                Time: <input type="text" className="form-time" value={this.state.startTime} placeholder="Time" onChange={this.handleChange} />
              </div>
              <div>
                <button type="button" onClick={this.closeModal}> Nah </button>
                <button type="submit" value="Looks good!" onClick={this.handleSubmit}>Looks Good </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

module.exports = Form;
