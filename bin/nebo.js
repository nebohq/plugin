#!/usr/bin/env node

const init = require('../src/init');
const build = require('../src/build');
const watch = require('../src/watch');
const { Parser } = require('../src/options');

const commands = [init, build, watch].reduce((acc, runner) => {
  const parser = new Parser(runner.allowedOptions);
  acc[runner.command] = (...args) => runner.singleton.run(parser.parse(args));
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
