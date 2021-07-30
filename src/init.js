const { join } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const defaults = require('./defaults');
const { Parser } = require('./options');

class Initializer {
  constructor() {
    this.optionsParser = new Parser(Initializer.allowedOptions);
  }

  run(...args) {
    const options = this.optionsParser.parse(args);

    const {
      accessToken,
      configPath = defaults.configPath,
    } = options;
    delete options.accessToken;

    // write the directory config file
    if (!existsSync(configPath)) {
      writeFileSync(configPath, this.getNeboConfigContents(accessToken));
    }
    // write the webpack compiler config file
    if (!existsSync(defaults.webpackPath)) {
      writeFileSync(defaults.webpackPath, this.getWebpackConfigContents(options));
    }

    console.log(`
      Finished setting up Nebo.
      - ${configPath} contains the Nebo JS library configuration. 
      - ${defaults.webpackPath} contains the Nebo webpack configuration.
    `.trim());
  }

  getNeboConfigContents(accessToken) {
    let configFile = readFileSync(join(__dirname, '..', 'static', 'nebo.js')).toString();
    if (accessToken) configFile = configFile.replace(/\[ACCESS_TOKEN]/, accessToken);
    return configFile;
  }

  getWebpackConfigContents(config) {
    let webpackFile = readFileSync(join(__dirname, '..', 'static', 'nebo.config.js')).toString();
    Object.entries(Initializer.optionsToFile).forEach(([option, replaceString]) => {
      const value = JSON.stringify(option in config ? config[option] : defaults[option]);
      webpackFile = webpackFile.replace(replaceString, value);
    });
    return webpackFile;
  }
}

Initializer.allowedOptions = {
  '--access-token': 'accessToken',
  '--config-path': 'configPath',
  '--public-path': 'publicPath',
  '--global-styles-path': 'globalStylesPath',
};

Initializer.optionsToFile = {
  configPath: 'CONFIG_PATH',
  publicPath: 'PUBLIC_PATH',
  globalStylesPath: 'GLOBAL_STYLES_PATH',
};

module.exports = new Initializer();
module.exports.command = 'init';
