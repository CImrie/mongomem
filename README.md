# MongoMem

This package provides an in-memory MongoDB Server.
Designed with testing in mind, the server will allow you to connect
your favourite ODM or client library to the MongoDB Server and run integration tests isolated from each other.

**Note about AVA Test Runner**
The package was designed to run one server instance (max) at a time. As such it runs one server instance
per test file in AVA (as a result of AVA using forked processes).
This has no negative consequences but it does mean that you should call
`MongoDBServer.start()` only once, at the top of an imported file or test file.
Calling it in a helper method may result in either unexpected behaviour or multiple servers running per test file.

## Usage

The example below uses async/await from ES7. If you wish to use the same syntax,
you should transpile your code using `babel-preset-es2017`. Alternatively, if you are already
using ES6 then you can convert it to the appropriate Promise syntax.

Available on NPM using: `npm install mongomem --save-dev` or `yarn add mongomem --dev`

*See here for usage examples: https://coligo.io/javascript-async-await/* 

```javascript
// helpers.js
import mongoose from 'mongoose'
import { MongoDBServer } from 'mongomem'

// MongoDBServer.debug = true;
let serverHasStarted = MongoDBServer.start();

export default {
  async getMongooseMock() {
      // 
      const mongooseInstance = new mongoose.Mongoose();
      await serverHasStarted;
    
      // MongoDBServer.getConnectionString() returns a new UUID4 on every call.
      // This allows you to get a unique database whilst utilising one in-memory server.
      let db = await MongoDBServer.getConnectionString();
      await mongooseInstance.connect(db, {promiseLibrary: Promise});
      
      // Re-assign original mongose models to new Mongoose connection
      Object.keys(mongoose.models).forEach(name => {
        const model = mongoose.models[name];
        mongooseInstance.model(name, model.schema);
      });
    
      return mongooseInstance;
  }
}

```

