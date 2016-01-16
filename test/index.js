'use strict';

var test = require('tape');

var fanoutTask = require('../index.js');

test('fanoutTask is a function', function t(assert) {
    assert.equal(typeof fanoutTask, 'function');
    assert.end();
});
