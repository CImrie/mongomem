import {MongodHelper} from 'mongodb-prebuilt';
import uuid from 'uuid/v4';
import tmp from 'tmp';
import portfinder from 'portfinder';

let getHelper = () => {
    return new Promise(async (resolve, reject) => {
        portfinder.basePort = server.port || 27017;

        server.port = await portfinder.getPortPromise();
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

        resolve(mongodHelper);
    });
};

let start = async () => {
    let helper = await getHelper();
    server.tearDown = () => {
        helper.mongoBin.childProcess.kill();
    };

    return await helper.run();
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
};

export default server;