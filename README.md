# fanout-task

<!--
    [![build status][build-png]][build]
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

Efficient zero-alloc parallel fanout

## Example

```js
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
}

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
```

## Installation

`npm install fanout-task`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licensed

  [build-png]: https://secure.travis-ci.org/Raynos/fanout-task.png
  [build]: https://travis-ci.org/Raynos/fanout-task
  [cover-png]: https://coveralls.io/repos/Raynos/fanout-task/badge.png
  [cover]: https://coveralls.io/r/Raynos/fanout-task
  [dep-png]: https://david-dm.org/Raynos/fanout-task.png
  [dep]: https://david-dm.org/Raynos/fanout-task
  [npm-png]: https://nodei.co/npm/fanout-task.png?stars&downloads
  [npm]: https://nodei.co/npm/fanout-task
