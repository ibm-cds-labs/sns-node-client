# sns-node-client
A Node.JS client for the [Simple Notification Service](https://github.com/ibm-cds-labs/simple-notification-service).

Please refer to the Simple Notification Service readme file for the following:

* [Sending Notifications](https://github.com/ibm-cds-labs/simple-notification-service#snssend-userquery-notificationdata-)
* [Handling Events](https://github.com/ibm-cds-labs/simple-notification-service#events)

## Connecting and Authentication
There is a slight difference between the Node.JS client library and the Browser based client library, and that is how you connect and authenticate with the Simple Notification Service.

As well as providing an API key, some `userData` and a `userQuery`, you will also need to provide a hostname. This hostname will be tied to the API key that you have supplied in exactly the same way as [via the browser](https://github.com/ibm-cds-labs/simple-notification-service#authentication).

The way of providing this data is also slightly different:

````js
const SNSClient = require('sns-node-client')({
  sns_host: '<YOUR_SNS_HOSTNAME>',
  authentication: {
    host: "<YOUR_AUTH_HOST>",
    key: "<YOUR_API_KEY>"
  },
  userData: {
    name: "Matt",
    age: 32,
    country: "USA",
    user_type: "chat"
  },
  userQuery: {
    country: "USA",
    user_type: "chat"
  }
});
````