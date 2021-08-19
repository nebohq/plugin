#!/usr/bin/env node

const init = require('../src/init');
const build = require('../src/build');
const watch = require('../src/watch');

const run = require('../src/run');

run([init, build, watch]);
