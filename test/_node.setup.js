'use strict';

const opts = {
  production: false,
  static: null,
  authentication: [
    { hostname: 'localhost', key: 'demokey' }
  ],
  router: null
}

const sns = require('simple-notification-service')(opts);

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

global._sns_hostname = null;
global.generateSNSOpts = (sns_host, type) => {

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321"

  var name = chars.split("").shuffle().splice(0, 14).join("");
  var type = type || chars.split("").shuffle().splice(0, 14).join("");

  var opts =  {
    sns_host: sns_host,
    authentication: {
      host: "localhost",
      key: "demokey"
    },
    userData: {
      name: name,
      type: type
    },
    userQuery: {
      type: type
    }
  }

  return opts;

}

// ensure server is started before running any tests
before((done) => {

  sns.events.on('started', (hostname) => {
    console.log('[OK]  Server is up');
    global._sns_hostname = hostname;
    done();
  });

});