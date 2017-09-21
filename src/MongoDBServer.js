import {MongodHelper} from 'mongodb-prebuilt';
import uuid from 'uuid/v4';
import tmp from 'tmp';
import getport from 'get-port';
tmp.setGracefulCleanup();

let getHelper = () => {
  return new Promise(async (resolve, reject) => {
    server.port = await getport(server.port || 27017);
    server.storageEngine = server.storageEngine|| 'ephemeralForTest';
    server.tmpFile = tmp.dirSync({prefix: "mongomem-", unsafeCleanup: true});

    server.dbPath = server.dbPath || server.tmpFile.name;

    let mongodHelper = new MongodHelper(
      [
        '--port', server.port,
        '--storageEngine', server.storageEngine,
        '--dbpath', server.dbPath,
        '--noauth'
      ]
    );

    mongodHelper.debug.enabled = server.debug;

    if(mongodHelper) {
      resolve(mongodHelper);
    } else {
      reject(mongodHelper);
    }
  });
};

let start = async () => {
  if(server.running) {
    return server.running;
  }

  let helper = await getHelper();
  let started = await helper.run();
  server.running = true;

  let child = helper.mongoBin.childProcess;
  
  child.on('exit', function() {
    server.running = false;
  });

  child.on('SIGINT', () => {});
  child.on('uncaughtException', () => {});

  server.tearDown = async () => {
    if(server.running) {
      await server.tmpFile.removeCallback();
      await helper.mongoBin.childProcess.kill();
      server.running = false;
    }
  };

  return started;
};

let getConnectionString = async() => {
  let db = await uuid();
  return "mongodb://localhost:" + server.port + "/" + db;
};

let server = {
  start,
  getConnectionString,
  port: null,
  storageEngine: 'ephemeralForTest',
  dbPath: null,
  debug: false,
  tearDown: null,
  running: null,
};

export default server;