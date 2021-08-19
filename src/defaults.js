const { resolve } = require('path');
const { existsSync } = require('fs');

class Settings {
  constructor(settings) {
    this.rawSettings = settings;
    Object.assign(this, settings);
  }

  parseCompilerConfig() {
    const {
      isDevelopment = this.isDevelopment,
      configPath = this.configPath,
      publicPath = this.publicPath,
      globalStylesPath: stylePaths = this.globalStylesPath,
      configure = (config) => config,
    } = existsSync(this.webpackPath) ? require(resolve(this.webpackPath)) : {};

    return {
      isDevelopment,
      configPath,
      publicPath: resolve(publicPath),
      globalStylesPath: Array.isArray(stylePaths) ? stylePaths : [stylePaths].filter(Boolean),
      configure,
    };
  }

  update(updatedSettings) {
    return new Settings({ ...this.rawSettings, ...updatedSettings });
  }
}

const defaults = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  configPath: './nebo.js',
  webpackPath: './nebo.config.js',
  publicPath: './public',
  globalStylesPath: null,
};

module.exports = new Settings(defaults);
