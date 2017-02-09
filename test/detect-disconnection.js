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

describe('Detect Disconnection', () => {

  // check that we can detect other connections to the SNS
  it('Should be able to detect disconnects to SNS', (done) => {
    
    var handler = (user) => {
      if (user.name == user2.userData.name && user.type == user2.userData.type) {
        return done();
      }
    }

    var actions = {};

    actions.user1 = (callback) => {
      const sns1 = new SNSClient(user1);
      sns1.on('connectedUser', handler);
      sns1.on('connected', callback);
    }

    actions.user2 = (callback) => {
      const sns2 = new SNSClient(user2);
      sns2.on('connected', sns2.disconnect);
    }

    async.series(actions)

  });

});