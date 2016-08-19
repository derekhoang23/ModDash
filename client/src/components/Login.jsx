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
        localStorage.setItem('token', data.token)
      });
    });
  }
  
  logout() {
    localStorage.removeItem('token');
    location.reload();
  }

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
          <div onClick={this.logout}>
          Log out
          </div>
        </div>
      )
    }
  }
}

module.exports = Login;