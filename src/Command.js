const { Parser } = require('./options');

class Command {
  constructor({
    name,
    runner,
    allowedOptions = {},
    callback = null,
  }) {
    this.name = name;
    this.singleton = runner;
    this.allowedOptions = allowedOptions;
    this.parser = new Parser(allowedOptions);
    this.callback = callback || (async (options, processor) => processor(options));
  }

  async run(...args) {
    const options = this.parser.parse(args);
    return this.callback(options, () => this.singleton.run(options));
  }

  configure({
    options,
    allowedOptions = null,
    callback = null,
  }) {
    return new Command({
      name: this.name,
      runner: new this.singleton.constructor(options),
      allowedOptions: allowedOptions || this.allowedOptions,
      callback: callback || this.callback,
    });
  }
}

module.exports = Command;
