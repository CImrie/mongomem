import {MongodHelper} from 'mongodb-prebuilt';
import uuid from 'uuid/v4';
import tmp from 'tmp';
import portfinder from 'portfinder';

let getHelper = () => {
    return new Promise(async (resolve, reject) => {
        portfinder.basePort = server.port;

        server.port = await portfinder.getPortPromise();
        server.storageEngine = 'ephemeralForTest';
        server.dbPath = tmp.dirSync({prefix: "mongomem-"}).name;

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

    return await helper.run();
};

let getConnectionString = async() => {
    let db = await uuid();
    return "mongodb://localhost:" + server.port + "/" + db;
};

let server = {
    start,
    getConnectionString,
    port: 27017,
    storageEngine: 'ephemeralForTest',
    dbPath: null,
    debug: false,
};

export default server;