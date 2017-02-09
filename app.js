"use strict";

const socket = require('socket.io-client');
const EventEmitter = require('events');
const url = require('url');

// socket.on('connect', function(){});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});

const SNSClient = function(opts) {

  if (typeof opts.authentication !== "object" || opts.authentication === null) {
    throw 'SNS: invalid authentication object provided';
    return;
  }

  this.key = opts.authentication.key || "";
  this.sns_host = opts.sns_host || ""
  this.host = opts.authentication.host || "";
  this.https = (this.host.match(/^https/) ? true : false)
  this.userData = opts.userData || null
  this.userQuery = opts.userQuery || null
  this.socket = null;
  this.events = new EventEmitter();
  this.events.id = null;
  this.events.connected = false;

  /*
   *  Validation
   *  Check that we have the required information provided 
   */
 

  // check an sns_host host has been supplied
  if (typeof this.sns_host != "string" || this.sns_host === "") {
    throw 'SNS: an SNS hostname must be supplied';
    return;
  }

  // check an authentication host has been supplied
  if (typeof this.host != "string" || this.host === "") {
    throw 'SNS: an authentication Host must be supplied';
    return;
  }

  // check an API key has been supplied
  if (typeof this.key != "string" || this.key === "") {
    throw 'SNS: an API key must be supplied';
    return;
  }

  //check that userData is passed in
  if (typeof this.userData != "object") {
    throw 'SNS: You must supply a valid Javascript object in the userData parameter';
    return;
  }

  /*
   *  Connect to Socket.IO server
   */
  this.socket = socket(this.sns_host); //our socket.io object

  /*
   *  Handle Socket.IO events
   */

  // provide descriptive data on connection
  this.socket.on('connect', () => {
    this.events.connected = true;
    this.socket.emit('myData', { userData: this.userData, userQuery: this.userQuery, authentication: { key: this.key, hostname: this.host } })
    this.events.id = "/#" + this.socket.id;
    this.events.emit('connected');
  });

  // listen for authentication fail
  this.socket.on('authenticationFail', (err) => {
    this.socket.disconnect();
    this.events.id = null;
    this.events.connected = false;
    throw new Error("SNS: Failed to authenticate");      
  });

  // listen for incoming messages
  this.socket.on('notification', (data) => {
    this.events.emit('notification', data);
  });

  // listen for incoming message event (used for front-end, undocumented)
  this.socket.on('notificationPing', () => {
    this.events.emit('notificationPing');
  });

  // listen for the currently connected users (that we care about, when we connect)
  this.socket.on("currentUsers", (users) => {
    this.events.emit('currentUsers', users);
  })

  // listen for newly connecting users (that we care about)
  this.socket.on("connectedUser", (user) => {
    this.events.emit('connectedUser', user);
  })

  // listen for newly connecting users (that we care about)
  this.socket.on("disconnectedUser", (user) => {
    this.events.emit('disconnectedUser', user);
  });

  /*
   *  Websocket API methods
   */

  // websocket API send request
  this.send = (query, data) => {

    if (this.events.connected === false) {
      throw 'SNS: not connected';
      return;
    }
    
    this.socket.emit('notification', { query: query, data: data })
    
  };

  // disconnect from the server
  this.disconnect = () => {

    this.socket.disconnect();

  };

  this.events.send = this.send;
  this.events.disconnect = this.disconnect;

  return this.events;

}

module.exports = SNSClient;