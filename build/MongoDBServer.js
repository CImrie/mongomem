'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _mongodbPrebuilt = require('mongodb-prebuilt');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _getPort = require('get-port');

var _getPort2 = _interopRequireDefault(_getPort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tmp2.default.setGracefulCleanup();

var getHelper = function getHelper() {
  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      var mongodHelper;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _getPort2.default)(server.port || 27017);

            case 2:
              server.port = _context.sent;

              server.storageEngine = server.storageEngine || 'ephemeralForTest';
              server.tmpFile = _tmp2.default.dirSync({ prefix: "mongomem-", unsafeCleanup: true });

              server.dbPath = server.dbPath || server.tmpFile.name;

              mongodHelper = new _mongodbPrebuilt.MongodHelper(['--port', server.port, '--storageEngine', server.storageEngine, '--dbpath', server.dbPath, '--noauth']);


              mongodHelper.debug.enabled = server.debug;

              if (mongodHelper) {
                resolve(mongodHelper);
              } else {
                reject(mongodHelper);
              }

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var start = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var helper, started;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!server.running) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', server.running);

          case 2:
            _context2.next = 4;
            return getHelper();

          case 4:
            helper = _context2.sent;

            server.tearDown = function () {
              server.tmpFile.removeCallback();
              if (helper.mongoBin.childProcess.connected) {
                helper.mongoBin.childProcess.kill();
              }
            };

            _context2.next = 8;
            return helper.run();

          case 8:
            started = _context2.sent;

            server.running = started;

            return _context2.abrupt('return', started);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function start() {
    return _ref2.apply(this, arguments);
  };
}();

var getConnectionString = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var db;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _v2.default)();

          case 2:
            db = _context3.sent;
            return _context3.abrupt('return', "mongodb://localhost:" + server.port + "/" + db);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getConnectionString() {
    return _ref3.apply(this, arguments);
  };
}();

var server = {
  start: start,
  getConnectionString: getConnectionString,
  port: null,
  storageEngine: 'ephemeralForTest',
  dbPath: null,
  debug: false,
  tearDown: null,
  running: null
};

exports.default = server;