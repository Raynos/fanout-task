'use strict';

function OrderedFanoutTask() {
    this.self = null;
    this.onItem = null;
    this.onComplete = null;
    this._resultCollectors = null;
    this._resultCollectorLength = 0;

    this.cb = null;
    this.counter = null;
    this.results = null;
}

OrderedFanoutTask.prototype.run =
function run(records, cb) {
    this.counter = records.length;
    this.cb = cb;

    if (this._resultCollectorLength < this.counter) {
        this.ensureResultCollectors();
    }

    for (var i = 0; i < records.length; i++) {
        var onItem = this.onItem;
        var onResult = this._resultCollectors[i].onResult;
        onItem(this, records[i], i, onResult);
    }
};

OrderedFanoutTask.prototype.ensureResultCollectors =
function ensureResultCollectors() {
    var counter = this.counter;

    if (!this._resultCollectors) {
        this._resultCollectors = [];
    }

    var start = this._resultCollectors.length;
    for (var i = start; i < counter; i++) {
        this._resultCollectors[i] = new ResultObject(this, i);
    }
    this._resultCollectorLength = this._resultCollectors.length;
};

OrderedFanoutTask.prototype.insertResult =
function insertResult(key, err, value) {
    this.results[key] = new Result(err, value);

    if (--this.counter === 0) {
        var onComplete = this.onComplete;
        onComplete(this, this.results, this.cb);
    }
};

OrderedFanoutTask.freeList = [];
for (var i = 0; i < 1000; i++) {
    OrderedFanoutTask.freeList.push(new OrderedFanoutTask());
}

OrderedFanoutTask.alloc = function alloc(ctx, onItem, onComplete) {
    var task;

    if (OrderedFanoutTask.freeList.length === 0) {
        task = new OrderedFanoutTask();
    } else {
        task = OrderedFanoutTask.freeList.pop();
    }

    task.self = ctx;
    task.onItem = onItem;
    task.onComplete = onComplete;
    task.results = [];

    return task;
};

OrderedFanoutTask.release = function release(task) {
    task.results = null;

    OrderedFanoutTask.freeList.push(task);
};

module.exports = OrderedFanoutTask;

function ResultObject(task, key) {
    this.task = task;
    this.key = key;

    this.onResult = null;
    this.allocClosure();
}

ResultObject.prototype.allocClosure =
function allocClosure() {
    var self = this;

    self.onResult = onResult;

    function onResult(err, result) {
        self.task.insertResult(self.key, err, result);
    }
};

function Result(err, value) {
    this.err = err;
    this.value = value;
}
