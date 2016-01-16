'use strict';

function OrderedFanoutRequest() {
    this.self = null;
    this.onItem = null;
    this.onComplete = null;
    this._resultCollectors = null;
    this._resultCollectorLength = 0;

    this.cb = null;
    this.counter = null;
    this.results = null;
}

OrderedFanoutRequest.prototype.run =
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

OrderedFanoutRequest.prototype.ensureResultCollectors =
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

OrderedFanoutRequest.prototype.insertResult =
function insertResult(key, err, value) {
    this.results[key] = new Result(err, value);

    if (--this.counter === 0) {
        var onComplete = this.onComplete;
        onComplete(this, this.results, this.cb);
    }
};

OrderedFanoutRequest.freeList = [];
for (var i = 0; i < 1000; i++) {
    OrderedFanoutRequest.freeList.push(new OrderedFanoutRequest());
}

OrderedFanoutRequest.alloc = function alloc(ctx, onItem, onComplete) {
    var req;

    if (OrderedFanoutRequest.freeList.length === 0) {
        req = new OrderedFanoutRequest();
    } else {
        req = OrderedFanoutRequest.freeList.pop();
    }

    req.self = ctx;
    req.onItem = onItem;
    req.onComplete = onComplete;
    req.results = [];

    return req;
};

OrderedFanoutRequest.release = function release(req) {
    req.results = null;

    OrderedFanoutRequest.freeList.push(req);
};

module.exports = OrderedFanoutRequest;

function ResultObject(req, key) {
    this.req = req;
    this.key = key;

    this.onResult = null;
    this.allocClosure();
}

ResultObject.prototype.allocClosure =
function allocClosure() {
    var self = this;

    self.onResult = onResult;

    function onResult(err, result) {
        self.req.insertResult(self.key, err, result);
    }
};

function Result(err, value) {
    this.err = err;
    this.value = value;
}
