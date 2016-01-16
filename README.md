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

## Benchmarks

```
raynos at raynos-SVS15127PXB  ~/projects/fanout-task on implementation*
$ node benchmark/next-tick-fan-out.js --runs 100000
runParallel { mean: 29.34235,
  stdDev: 147.61414459953534,
  median: 23,
  mode: [ 21 ],
  variance: 21789.935685834378,
  quartiles: 
   { q1: 21,
     q2: 23,
     q3: 30,
     iqr: 9,
     lowerFence: 7.5,
     upperFence: 43.5,
     insiders: null,
     outsiders: null } }
async { mean: 21.70497,
  stdDev: 132.7226224885066,
  median: 16,
  mode: [ 16 ],
  variance: 17615.294520244333,
  quartiles: 
   { q1: 16,
     q2: 16,
     q3: 18,
     iqr: 2,
     lowerFence: 13,
     upperFence: 21,
     insiders: null,
     outsiders: null } }
collectParallel { mean: 16.92722,
  stdDev: 129.76586652465463,
  median: 14,
  mode: [ 10 ],
  variance: 16839.18011487274,
  quartiles: 
   { q1: 10,
     q2: 14,
     q3: 15,
     iqr: 5,
     lowerFence: 2.5,
     upperFence: 22.5,
     insiders: null,
     outsiders: null } }
fastparallel { mean: 18.16369,
  stdDev: 102.19139487452472,
  median: 14,
  mode: [ 12 ],
  variance: 10443.08118639576,
  quartiles: 
   { q1: 12,
     q2: 14,
     q3: 17,
     iqr: 5,
     lowerFence: 4.5,
     upperFence: 24.5,
     insiders: null,
     outsiders: null } }
fanout-request { mean: 15.92218,
  stdDev: 106.80096389316685,
  median: 14,
  mode: [ 14 ],
  variance: 11406.445888506543,
  quartiles: 
   { q1: 10,
     q2: 14,
     q3: 14,
     iqr: 4,
     lowerFence: 4,
     upperFence: 20,
     insiders: null,
     outsiders: null } }
```

```
raynos at raynos-SVS15127PXB  ~/projects/fanout-task on implementation*
$ node benchmark/set-immediate-fan-out.js --runs 100000
runParallel { mean: 35.59819,
  stdDev: 162.33492139711345,
  median: 28,
  mode: [ 28 ],
  variance: 26352.62670499099,
  quartiles: 
   { q1: 27,
     q2: 28,
     q3: 30,
     iqr: 3,
     lowerFence: 22.5,
     upperFence: 34.5,
     insiders: null,
     outsiders: null } }
async { mean: 21.08103,
  stdDev: 108.71812075469205,
  median: 16,
  mode: [ 15 ],
  variance: 11819.629780436939,
  quartiles: 
   { q1: 15,
     q2: 16,
     q3: 18,
     iqr: 3,
     lowerFence: 10.5,
     upperFence: 22.5,
     insiders: null,
     outsiders: null } }
collectParallel { mean: 18.45391,
  stdDev: 102.97698819784316,
  median: 15,
  mode: [ 14 ],
  variance: 10604.260098312887,
  quartiles: 
   { q1: 14,
     q2: 15,
     q3: 15,
     iqr: 1,
     lowerFence: 12.5,
     upperFence: 16.5,
     insiders: null,
     outsiders: null } }
fastparallel { mean: 19.60615,
  stdDev: 90.33791840407677,
  median: 16,
  mode: [ 16 ],
  variance: 8160.93950157252,
  quartiles: 
   { q1: 16,
     q2: 16,
     q3: 17,
     iqr: 1,
     lowerFence: 14.5,
     upperFence: 18.5,
     insiders: null,
     outsiders: null } }
fanout-request { mean: 17.522,
  stdDev: 90.61155114294955,
  median: 14,
  mode: [ 14 ],
  variance: 8210.45320053201,
  quartiles: 
   { q1: 14,
     q2: 14,
     q3: 15,
     iqr: 1,
     lowerFence: 12.5,
     upperFence: 16.5,
     insiders: null,
     outsiders: null } }
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
