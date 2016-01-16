'use strict';

var test = require('tape');
var setTimeout = require('timers').setTimeout;

var OrderedFanoutTask = require('../ordered.js');
var UnorderedFanoutTask = require('../unordered.js');

test('fanout timers in order', function t(assert) {
    var task = OrderedFanoutTask.alloc(
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

            OrderedFanoutTask.release(task);
            assert.end();
        }
    );

    task.run([50, 100, 200], null);
});

test('fanout timers in unorder', function t(assert) {
    var task = UnorderedFanoutTask.alloc(
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

            UnorderedFanoutTask.release(task);
            assert.end();
        }
    );

    task.run([50, 100, 200], null);
});
