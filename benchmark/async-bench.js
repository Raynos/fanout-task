'use strict';

var console = require('console');
var process = global.process;
var minimist = require('minimist');
var asyncBench = require('async_bench');

var argv = minimist(process.argv.slice(2));
var runs = argv.runs || 500;

module.exports = runBenchmarks;

function runBenchmarks(funcs) {
    var keys = Object.keys(funcs);
    loop();

    function loop() {
        if (keys.length === 0) {
            return;
        }

        var key = keys.shift();
        var func = funcs[key];

        asyncBench({
            preHeat: runs,
            runs: runs,
            bench: func,
            complete: print(key, loop)
        });
    }
}

function print(prefix, next) {
    /*eslint no-console: 0*/
    return function complete(err, results) {
        if (err) {
            console.error(err);
            throw err;
        }

        if (results.quartiles) {
            results.quartiles.insiders = null;
            results.quartiles.outsiders = null;
        }
        console.log(prefix, results);
        next();
    };
}
