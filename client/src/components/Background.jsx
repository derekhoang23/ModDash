import React from 'react';

class Background extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      background: 5
    }
  }

  componentDidMount() {
    // for choosing random background, change 6 to number of images available
    var newBackground = Math.floor(Math.random() * 5) + 1;
    this.setState({
      background: newBackground
    });
  }

  render() {
    return (
      <div>
        <div className="background" style={{"backgroundImage": `url(./assets/backgrounds/space${this.state.background}.jpeg)`}}>
        </div>
      </div> 
    );
  }

}

export default Background;
