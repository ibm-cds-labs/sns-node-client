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

describe('Detect Current Users', () => {

  // check that we can detect currently connected users
  it('Should be able to detect currently connected users', (done) => {
    
    var handler = (users) => {
      assert(typeof users, "object")
      assert(users.length, 2)
      assert(users[0].name, user1.userData.name)
      assert(users[0].type, user1.userData.type)
      assert(users[1].name, user2.userData.name)
      assert(users[1].name, user2.userData.type)
      return done();
    }

    var actions = {};

    actions.user1 = (callback) => {
      const sns1 = new SNSClient(user1);
      sns1.on('connected', callback);
    }

    actions.user2 = (callback) => {
      const sns2 = new SNSClient(user2);
      sns2.on('connected', callback);
      sns2.on('currentUsers', handler);
    }

    async.series(actions)

  });

});