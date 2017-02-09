'use strict';

var SNSClient = require('../app'),
    assert = require('assert'),
    async = require('async');

var user1, user2;

before((done) => {
  
  user1 = generateSNSOpts(_sns_hostname);
  user2 = generateSNSOpts(_sns_hostname, user1.userData.type);

  return done();

})

describe('Notifications', () => {

  // check that we can detect currently connected users
  it('Should be able to send and receive notifications', (done) =>{
    
    var received = [];
    var handler = (data) => {
      assert(typeof data, "object")
      assert(typeof data.foo, "string")
      assert(data.foo, "bar")
      received.push(data);
      if (received.length === 2) return done();
    }

    var actions = {};

    actions.user1 = (callback) => {
      const sns1 = new SNSClient(user1);
      sns1.on('notification', handler)
      sns1.on('connected', () => {
        return callback(null, sns1);
      });
    }

    actions.user2 = (callback) => {
      const sns2 = new SNSClient(user2);
      sns2.on('notification', handler)
      sns2.on('connected', () => {
        return callback(null, sns2);
      });
    }

    async.series(actions, (err, users) => {

      users.user1.send({ type: user1.userData.type }, { foo: "bar" })

    })

  });

  // check that we can detect currently connected users
  it('Should be able to send and receive notifications for a specific user', (done) => {
    
    var received = [];
    var handler = (data) => {
      assert(typeof data, "object")
      assert(typeof data.foo, "string")
      assert(data.foo, "bar")
      received.push(data);
      if (received.length === 1) return done();
    }

    var actions = {};

    actions.user1 = (callback) => {
      const sns1 = new SNSClient(user1);
      sns1.on('notification', handler)
      sns1.on('connected', () => {
        return callback(null, sns1);
      });
    }

    actions.user2 = (callback) => {
      const sns2 = new SNSClient(user2);
      sns2.on('notification', handler)
      sns2.on('connected', () => {
        return callback(null, sns2);
      });
    }

    async.series(actions, (err, users) => {

      users.user1.send({ type: user2.userData.type, name: user1.userData.name }, { foo: "bar" })

    })

  });

});