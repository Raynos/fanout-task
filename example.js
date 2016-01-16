'use strict';

var FanoutTask = require('fanout-task/ordered');

function Logger() {
}

Logger.prototype.log = function log(record, cb) {
    console.log(record);
    cb(null);
};

Logger.prototype.logMany = function logMany(records, cb) {
    var task = FanoutTask.alloc(this, logEachRecord, onLogsDone);
    task.run(records, cb);
};

function logEachRecord(task, record, _, cb) {
    task.self.log(record, cb);
}

function onLogsDone(task, results, cb) {
    FanoutTask.release(task);

    for (var i = 0; i < results; i++) {
        if (results[i].err) {
            return cb(results[i].err);
        }
    }

    cb(null);
}
