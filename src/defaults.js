const { resolve } = require('path');
const { existsSync } = require('fs');

const defaults = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  configPath: './nebo.js',
  webpackPath: './nebo.config.js',
  publicPath: './public',
  globalStylesPath: null,
};

module.exports = defaults;
module.exports.parseCompilerConfig = () => {
  const {
    isDevelopment = defaults.isDevelopment,
    configPath = defaults.configPath,
    publicPath = defaults.publicPath,
    globalStylesPath: stylePaths = defaults.globalStylesPath,
    configure = (config) => config,
  } = existsSync(defaults.webpackPath) ? require(resolve(defaults.webpackPath)) : {};

  return {
    isDevelopment,
    configPath,
    publicPath: resolve(publicPath),
    globalStylesPath: Array.isArray(stylePaths) ? stylePaths : [stylePaths].filter(Boolean),
    configure,
  };
};
