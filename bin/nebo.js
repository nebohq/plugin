#!/usr/bin/env node

const compile = require('../src/compile');
const init = require('../src/init');

const commands = {
  init,
  compile,
};

// eslint-disable-next-line prefer-const
let [command, ...options] = process.argv.slice(2);
if (!command) command = 'compile';

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
