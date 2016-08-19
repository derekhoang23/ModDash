var pubnub = PUBNUB({
  subscribe_key: 'sub-c-db638056-601a-11e6-9bf3-02ee2ddab7fe',

  error: function (error) {
    console.log('Error:', error);
  },
  message: function( message, env, channel ){
    console.log('pubnub message', message)
  },
  connect: function(){
    console.log("Connected")
  },
  disconnect: function(){
    console.log("Disconnected")
  },
  reconnect: function(){
    console.log("Reconnected")
  }
});


const subscribe = () => {
  var channel = localStorage.getItem('channel');
  console.log('running subscribe', channel);
  if (channel) {
    pubnub.subscribe({
      channel: channel,
      message: function(data) {
        sendNotification(data);
      }
    });    
  } else {
    setTimeout(subscribe, 10000);
    // check every 10 seconds to see if user is logged in and has a channel to subscribe to for notifications
  }
}

setTimeout(subscribe, 1000);

const sendNotification = (data) => {
  if (data.messageType === 'eventAdded') {
    sendEventAddedNotification(data);
  }
  if (data.messageType === 'timeToLeave') {
    sendTimeToLeaveNotification(data);
  }
}

const sendEventAddedNotification = (data) => {
  let start = moment(data.start.dateTime).format('LT');
  let end = moment(data.end.dateTime).format('LT');
  var notify = {
    type: 'basic',
    title: 'Your Calendar Event Has Been Added!',
    message: data.location + '\n' + start + ' - ' + end,
    iconUrl: 'sonic-dash.gif',
    buttons: [{
      title: 'Click To See Event Details'
    }]
  };
  chrome.notifications.onButtonClicked.addListener(function() {
    window.open(data.htmlLink);
  });

  chrome.notifications.create(notify, function() {
    console.log('created event added notification!');
  });
}

const sendTimeToLeaveNotification = (data) => {
  let start = moment(data.startdatetime).format('LT');
  let leave = {
    type: 'basic',
    title: `Time to Leave for ${data.name} at ${data.location}!`,
    message: `Your event is at ${start}, and it will take about ${Math.ceil(((parseInt(data.traffic) / 60) / 1000))} minutes to get there`,
    iconUrl: 'sonic-sega.png',
    buttons: [{
      title: 'Click To See Map Details'
    }]
  };
  chrome.notifications.onButtonClicked.addListener(function() {
    window.open(`https://www.google.com/maps/dir/${data.origin}/${data.location}`);
  });

  chrome.notifications.create(leave, function() {
    console.log('created time to leave notification!');
  });
}