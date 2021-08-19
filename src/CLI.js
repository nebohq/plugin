const CLI = (commands = [], defaultCommand = 'build') => {
  const commandRunners = commands.reduce((acc, command) => {
    acc[command.name] = (...args) => command.run(...args);
    return acc;
  }, {});

  // eslint-disable-next-line prefer-const
  let [command, ...options] = process.argv.slice(2);
  if (!command) command = defaultCommand;

  try {
    if (!(command in commandRunners)) {
      throw new Error(`Unexpected command: \`${command}\``);
    } else {
      commandRunners[command](...options);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = CLI;
