import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';
import { Glyphicon } from 'react-bootstrap';
class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      selectedOption: ''
    };
    this.clickSetting = this.clickSetting.bind(this);
  }

  // componentDidMount() {
  //
  // }

  clickSetting() {
    if(this.state.showSettings === false) {
      this.setState({
        showSettings: true
      })
    } else {
      this.setState({
        showSettings: false
      })
    }
  }

  handleChange(value) {
    // e.preventDefault();
    console.log('value', value)
    this.setState({
      selectedOption: value
    })
  }


  handleSubmit() {
    // e.preventDefault();
    var token = localStorage.getItem('token');
    var state = this.state.selectedOption;
    this.props.transitChange(state);
    var transit = {transit: state};

    console.log('transit', transit);
    fetch('http://localhost:9000/api/users/updateTransit', {
      method: 'POST',
      body: JSON.stringify(transit),
      mode: 'cors-with-forced-preflight',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log('responded back with', data);
    })
    .catch((err) => {
      console.log('did not save mode to db', err);
    })
    this.setState({
      showSettings: false
    })
  }


  render() {
    let radio =
    <div className='trans-mode'>
          <div>
            <RadioGroup  name="transit"  selectedValue={this.state.selectedOption} onChange={this.handleChange.bind(this)}>
              Choose Your Transportation <br/>

              <Radio value="driving" />Driving <br/>
              <Radio value="walking" />Walking <br/>
              <Radio value="transit" />Transit <br/>
              <Radio value="bicyling" />Bicycling
            </RadioGroup>
          </div>
          <div className='radio-button'>
            <button type='button'  onClick={this.handleSubmit.bind(this)}>Submit</button>
          </div>
        </div>;

    return(
      <div>
        <div className='displayTransit'>
        </div>
        <div className='settings-glyph' onClick={this.clickSetting}> <Glyphicon glyph="cog" /></div>
        {this.state.showSettings ? radio : null}
      </div>
    )
  }
}

export default Setting;
