const { Parser } = require('./options');

const run = (runners = [], defaultCommand = 'build') => {
  const commands = runners.reduce((acc, runner) => {
    const parser = new Parser(runner.allowedOptions);
    acc[runner.command] = (...args) => runner.singleton.run(parser.parse(args));
    return acc;
  }, {});

  // eslint-disable-next-line prefer-const
  let [command, ...options] = process.argv.slice(2);
  if (!command) command = defaultCommand;

  try {
    if (!(command in commands)) {
      throw new Error(`Unexpected command: \`${command}\``);
    } else {
      commands[command](...options);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = run;
