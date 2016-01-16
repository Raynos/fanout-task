'use strict';

var process = global.process;
/*eslint-disable no-restricted-modules*/
var async = require('async');
/*eslint-enable no-restricted-modules*/
var runParallel = require('run-parallel');
var collectParallel = require('collect-parallel/array.js');
var fastparallel = require('fastparallel');
var FanoutRequest = require('../ordered');

var asyncBench = require('./async-bench.js');

var fastParallelInstance = fastparallel({
    results: true
});

asyncBench({
    'runParallel': function testAsync(cb) {
        var tasks = [1, 2, 3, 4, 5];
        var funcs = [];
        for (var i = 0; i < tasks.length; i++) {
            funcs.push(doubleAsyncThunk(tasks[i]));
        }

        runParallel(funcs, cb);
    },
    'async': function testAsync(cb) {
        var tasks = [1, 2, 3, 4, 5];
        async.map(tasks, doubleAsync, cb);
    },
    'collectParallel': function testAsync(cb) {
        var tasks = [1, 2, 3, 4, 5];
        collectParallel(tasks, doubleAsyncCollect, cb);
    },
    'fastparallel': function testAsync(cb) {
        var tasks = [1, 2, 3, 4, 5];

        fastParallelInstance(null, doubleAsync, tasks, cb);
    },
    'fanout-request': function testAsync(cb) {
        var tasks = [1, 2, 3, 4, 5];

        var req = FanoutRequest.alloc(
            null, doubleAsyncFanout, onFanoutComplete
        );
        req.run(tasks, cb);
    }
});

function doubleAsyncThunk(n) {
    return function thunk(callback) {
        doubleAsync(n, callback);
    };
}

function doubleAsync(n, callback) {
    process.nextTick(onTick);

    function onTick() {
        callback(null, n * 2);
    }
}

function doubleAsyncCollect(n, index, callback) {
    process.nextTick(onTick);

    function onTick() {
        callback(null, n * 2);
    }
}

function doubleAsyncFanout(req, n, index, callback) {
    process.nextTick(onTick);

    function onTick() {
        callback(null, n * 2);
    }
}

function onFanoutComplete(req, results, cb) {
    FanoutRequest.release(req);
    cb(null);
}
