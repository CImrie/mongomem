import test from 'ava';
import server from '../src/MongodServer';

let tmpServer = null;

test.before('setup mongo server', async t => {
    server.debug = true;
    tmpServer = await server.start();
});

test('random mongod server is started once', async t => {
    server.tearDown();
    t.pass();
});

test('always use same server instance if available', async t => {
    t.is(tmpServer, await server.start());
});