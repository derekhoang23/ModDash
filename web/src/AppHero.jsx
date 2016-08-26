import React from 'react';
import { Hero } from 'neal-react';

class AppHero extends React.Component {
  render() {
    return (
      <Hero backgroundImage="./assets/freeway_bg_wide.jpg" className="text-xs-center">
        <h1 className="display-2"> Velocity </h1>
        <p className="lead">
        A Smart Voice-Activated Dashboard for Google Chrome
        <br/>
        <br/>
        Integrating your Google Calendar with Google Maps traffic data, <br/>
        Velocity notifies you when to leave to be on time for your next event.
        <br/> <br/>
        Never be late again!
        </p>
        <p>
          <a href="https://chrome.google.com/webstore/detail/velocity-dashboard/fllacnobnahiecimbbehfbiilpmhnmkk/related" target="_blank" className="btn btn-white">
          Install the dashboard on Google Chrome
          </a>
        </p>
      </Hero>
    );
  }
};

export default AppHero;
