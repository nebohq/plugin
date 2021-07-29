#!/usr/bin/env node

const build = require('../src/build');
const init = require('../src/init');

const commands = [build, init].reduce((acc, runner) => {
  acc[runner.command] = (...args) => runner.run(...args);
  return acc;
}, {});

// eslint-disable-next-line prefer-const
let [command, ...options] = process.argv.slice(2);
if (!command) command = 'build';

try {
  if (!(command in commands)) {
    throw new Error(`Unexpected command: \`${command}\``);
  } else {
    commands[command](...options);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
