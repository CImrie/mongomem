import test from 'ava';
import server from '../src/MongodServer';

test.before('setup mongo server', async t => {
    await server.start();
});

test('random mongod server is started once', async t => {
    server.tearDown();
    t.pass();

});