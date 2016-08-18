import React from 'react';

class Setting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false,
      driveMode: 'driving'
    };
  }

  clickSetting() {
    this.setState({
      showSettings: true
    })
  }


  render() {
    return(
      <div>
        <div className='wheel'>
          <img src='https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_settings_48px-128.png' onClick={this.clickSetting.bind(this)}/>
        </div>
        <div>
          <form className='trans-mode'>
          Choose Transportation Mode <br/>
            <input type="radio" name="mode" value="driving"/>Driving<br/>
            <input type="radio" name="mode" value="walking"/>Walking<br/>
            <input type="radio" name="mode" value="bicycling"/>Bicyling<br/>
            <input type="radio" name="mode" value="transit"/>Transit<br/>
          </form>
        </div>
      </div>
    )
  }
}

export default Setting
