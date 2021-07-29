const { join } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const defaults = require('./defaults');

const allowedOptions = {
  '--access-token': 'accessToken',
  '--config-path': 'configPath',
  '--public-path': 'publicPath',
  '--global-styles-path': 'globalStylesPath',
  '--webpack-path': 'webpackPath',
};

module.exports = function init(...options) {
  const config = options.reduce((accumulator, string) => {
    const [type, value] = string.split('=');
    if (!(type in allowedOptions)) {
      throw new Error(`
        Unexpected option: \`${type}\`
        Available options: ${Object.keys(allowedOptions).join(', ')}
      `.trim());
    }
    accumulator[allowedOptions[type]] = value;
    return accumulator;
  }, {});

  const {
    accessToken,
    configPath = defaults.configPath,
  } = config;
  delete config.accessToken;
  console.log(config);

  // write the directory config file
  let configFile = readFileSync(join(__dirname, '..', 'static', 'nebo.config.js')).toString();
  if (accessToken) configFile = configFile.replace(/\[ACCESS_TOKEN]/, accessToken);
  if (!existsSync(configPath)) writeFileSync(configPath, configFile);

  // write the compiler config file
  writeFileSync('./.neborc', JSON.stringify(config, null, '  '));
};
