const { resolve } = require('path');
const { existsSync, readFileSync } = require('fs');

const defaults = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  configPath: './nebo.config.js',
  webpackPath: './nebo.webpack.js',
  publicPath: `${process.cwd()}/public`,
  globalStylesPath: null,
};

module.exports = defaults;
module.exports.parseCompilerConfig = () => {
  const {
    isDevelopment = defaults.isDevelopment,
    configPath = defaults.configPath,
    publicPath = defaults.publicPath,
    globalStylesPath: stylePaths = defaults.globalStylesPath,
    webpackPath = defaults.webpackPath,
  } = existsSync('./.neborc') ? JSON.parse(readFileSync('./.neborc')) : {};

  return {
    isDevelopment,
    configPath,
    webpackPath: resolve(webpackPath),
    publicPath: resolve(publicPath),
    globalStylesPath: Array.isArray(stylePaths) ? stylePaths : [stylePaths].filter(Boolean),
  };
};
