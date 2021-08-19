const { join } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const defaults = require('./defaults');

class Initializer {
  constructor({ logger = console, defaultSettings = defaults } = {}) {
    this.logger = logger;
    this.defaults = defaultSettings;
  }

  run(options) {
    const {
      accessToken,
      configPath = this.defaults.configPath,
    } = options;
    delete options.accessToken;

    // write the directory config file
    if (!existsSync(configPath)) {
      writeFileSync(configPath, this.getNeboConfigContents(accessToken));
    }
    // write the webpack compiler config file
    if (!existsSync(this.defaults.webpackPath)) {
      writeFileSync(this.defaults.webpackPath, this.getWebpackConfigContents(options));
    }

    this.logger.log(`
      Finished setting up Nebo.
      - ${configPath} contains the Nebo JS library configuration. 
      - ${this.defaults.webpackPath} contains the Nebo webpack configuration.
    `.trim());

    return Promise.resolve(true);
  }

  getNeboConfigContents(accessToken) {
    let configFile = readFileSync(join(__dirname, '..', 'static', 'nebo.js')).toString();
    if (accessToken) configFile = configFile.replace(/\[ACCESS_TOKEN]/, accessToken);
    return configFile;
  }

  getWebpackConfigContents(config) {
    let webpackFile = readFileSync(join(__dirname, '..', 'static', 'nebo.config.js')).toString();
    Object.entries(Initializer.optionsToFile).forEach(([option, replaceString]) => {
      const value = JSON.stringify(option in config ? config[option] : this.defaults[option]);
      webpackFile = webpackFile.replace(replaceString, value);
    });
    return webpackFile;
  }
}

Initializer.optionsToFile = {
  configPath: 'CONFIG_PATH',
  publicPath: 'PUBLIC_PATH',
  globalStylesPath: 'GLOBAL_STYLES_PATH',
};

module.exports = { singleton: new Initializer(), Initializer };
module.exports.command = 'init';
module.exports.allowedOptions = {
  '--access-token': 'accessToken',
  '--config-path': 'configPath',
  '--public-path': 'publicPath',
  '--global-styles-path': 'globalStylesPath',
};
