'use strict';

var test = require('tape');
var setTimeout = require('timers').setTimeout;

var OrderedFanoutRequest = require('../ordered.js');
var UnorderedFanoutRequest = require('../unordered.js');

test('fanout timers in order', function t(assert) {
    var req = OrderedFanoutRequest.alloc(
        null,
        function doTimer(_, value, i, callback) {
            setTimeout(onTimer, value);

            function onTimer() {
                callback(null, value);
            }
        },
        function onResults(_, results) {
            assert.deepEqual(results, [
                {
                    err: null, value: 50
                },
                {
                    err: null, value: 100
                },
                {
                    err: null, value: 200
                }
            ]);

            OrderedFanoutRequest.release(req);
            assert.end();
        }
    );

    req.run([50, 100, 200], null);
});

test('fanout timers in unorder', function t(assert) {
    var req = UnorderedFanoutRequest.alloc(
        null,
        function doTimer(_, value, i, callback) {
            setTimeout(onTimer, value);

            function onTimer() {
                callback(null, value);
            }
        },
        function onResults(_, results) {
            assert.deepEqual(results, [
                {
                    err: null, value: 50
                },
                {
                    err: null, value: 100
                },
                {
                    err: null, value: 200
                }
            ]);

            UnorderedFanoutRequest.release(req);
            assert.end();
        }
    );

    req.run([50, 100, 200], null);
});
