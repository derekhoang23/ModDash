import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  login() {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      console.log(token);
      fetch('http://localhost:9000/extensionAuth', {
        method: 'POST',
        body: JSON.stringify({token: token}),
        mode: 'cors-with-forced-preflight',
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log('data back from extensionAuth', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('channel', data.channel);
        location.reload();
      });
    });
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('channel');
    // need to tell backend that we have logged out and that the current subscribed channel is no longer valid and to start polling for a new channel
    // or no log out button and they just have to uninstall the extension
    location.reload();
  }
          // <div onClick={this.logout}>
          // Log out
          // </div>

  render() {
    if (!localStorage.getItem('token')) {
      return (
        <div>
          <div onClick={this.login}>
            Sign in
          </div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

module.exports = Login;