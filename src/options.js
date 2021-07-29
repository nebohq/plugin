class Parser {
  constructor(allowedOptions) {
    this.allowedOptions = allowedOptions;
  }

  parse(options) {
    return options.reduce((accumulator, string) => {
      const [type, value] = string.split('=');
      if (!(type in this.allowedOptions)) {
        throw new Error(`
        Unexpected option: \`${type}\`
        Available options: ${Object.keys(this.allowedOptions).join(', ')}
      `.trim());
      }
      accumulator[this.allowedOptions[type]] = value;
      return accumulator;
    }, {});
  }
}

module.exports = {
  Parser,
};
