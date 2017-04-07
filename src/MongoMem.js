import {MongodHelper} from 'mongodb-prebuilt';
import uuid from 'uuid/v4';

let startTempServer = () => {
    let mongodHelper = new MongodHelper();
    mongodHelper.mongoBin.commandArguments = [
        '--port', port,
        '--storageEngine', storageEngine,
        '--dbpath', dbPath
    ];

    mongodHelper.run().then(() => {
        resolve()
    });
};

let mock = (mongoose) => {

};

export default {

}