'use strict';

function UnorderedFanoutTask() {
    this.self = null;
    this.onItem = null;
    this.onComplete = null;
    this._collectResult = null;

    this.cb = null;
    this.counter = null;
    this.index = null;

    this.results = null;
    this.allocClosure();
}

UnorderedFanoutTask.prototype.allocClosure =
function allocClosure() {
    var self = this;

    self._collectResult = _collectResult;

    function _collectResult(err, result) {
        self.insertResult(err, result);
    }
};

UnorderedFanoutTask.prototype.run =
function run(records, cb) {
    this.counter = records.length;
    this.index = 0;
    this.cb = cb;

    for (var i = 0; i < records.length; i++) {
        var onItem = this.onItem;
        onItem(this, records[i], i, this._collectResult);
    }
};

UnorderedFanoutTask.prototype.insertResult =
function insertResult(err, value) {
    this.results[this.index++] = new Result(err, value);

    if (--this.counter === 0) {
        var onComplete = this.onComplete;
        onComplete(this, this.results, this.cb);
    }
};

UnorderedFanoutTask.freeList = [];
for (var i = 0; i < 1000; i++) {
    UnorderedFanoutTask.freeList.push(new UnorderedFanoutTask());
}

UnorderedFanoutTask.alloc = function alloc(ctx, onItem, onComplete) {
    var task;

    if (UnorderedFanoutTask.freeList.length === 0) {
        task = new UnorderedFanoutTask();
    } else {
        task = UnorderedFanoutTask.freeList.pop();
    }

    task.self = ctx;
    task.onItem = onItem;
    task.onComplete = onComplete;
    task.results = [];

    return task;
};

UnorderedFanoutTask.release = function release(task) {
    task.results = null;

    UnorderedFanoutTask.freeList.push(task);
};

module.exports = UnorderedFanoutTask;

function Result(err, value) {
    this.err = err;
    this.value = value;
}
