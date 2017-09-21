import ps from 'ps-node';

import test from 'ava';
import { MongoDBServer as server } from '../../src';

test.before('setup mongo server', async t => {
  server.debug = true;
  // tmpServer = await server.start();
});

test('server stops running after test', async t => {
  await server.start();
  await server.tearDown();

  t.is(server.running, false);
});
