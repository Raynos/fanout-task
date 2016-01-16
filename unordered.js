'use strict';

function UnorderedFanoutRequest() {
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

UnorderedFanoutRequest.prototype.allocClosure =
function allocClosure() {
    var self = this;

    self._collectResult = _collectResult;

    function _collectResult(err, result) {
        self.insertResult(err, result);
    }
};

UnorderedFanoutRequest.prototype.run =
function run(records, cb) {
    this.counter = records.length;
    this.index = 0;
    this.cb = cb;

    for (var i = 0; i < records.length; i++) {
        var onItem = this.onItem;
        onItem(this, records[i], i, this._collectResult);
    }
};

UnorderedFanoutRequest.prototype.insertResult =
function insertResult(err, value) {
    this.results[this.index++] = new Result(err, value);

    if (--this.counter === 0) {
        var onComplete = this.onComplete;
        onComplete(this, this.results, this.cb);
    }
};

UnorderedFanoutRequest.freeList = [];
for (var i = 0; i < 1000; i++) {
    UnorderedFanoutRequest.freeList.push(new UnorderedFanoutRequest());
}

UnorderedFanoutRequest.alloc = function alloc(ctx, onItem, onComplete) {
    var req;

    if (UnorderedFanoutRequest.freeList.length === 0) {
        req = new UnorderedFanoutRequest();
    } else {
        req = UnorderedFanoutRequest.freeList.pop();
    }

    req.self = ctx;
    req.onItem = onItem;
    req.onComplete = onComplete;
    req.results = [];

    return req;
};

UnorderedFanoutRequest.release = function release(req) {
    req.results = null;

    UnorderedFanoutRequest.freeList.push(req);
};

module.exports = UnorderedFanoutRequest;

function Result(err, value) {
    this.err = err;
    this.value = value;
}
