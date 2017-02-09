'use strict';

var SNSClient = require('../app'),
    assert = require('assert');

var user1, user2;

before((done) => {
  
  user1 = generateSNSOpts(_sns_hostname);
  user2 = generateSNSOpts(_sns_hostname, user1.userData.type);

  return done();

})

describe('Connection', () => {

  // check that we can connect to the SNS
  it('Should be able to connect to SNS', (done) => {
    
    const sns1 = new SNSClient(user1);

    sns1.on('connected', done)

  });

});