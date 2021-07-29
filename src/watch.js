const { resolve, join } = require('path');
const webpack = require('webpack');
const { Parser } = require('./options');
const Compiler = require('./build');
const defaults = require('./defaults');

class Watcher {
  constructor() {
    this.optionsParser = new Parser(Watcher.allowedOptions);
  }

  run(...args) {
    const options = this.optionsParser.parse(args);

    const {
      isDevelopment,
      configPath,
      publicPath,
      globalStylesPath,
      configure: modifyConfigWithUserConfiguration,
    } = { ...defaults.parseCompilerConfig(), ...options };

    const config = this.buildConfig({
      isDevelopment,
      configPath,
      publicPath: resolve(publicPath),
      globalStylesPath,
      modifyConfigWithUserConfiguration,
    });

    console.log('Nebo is watching for changes...');
    webpack(config).watch({
      ignored: ['**/node_modules'],
    }, (err, stats) => {
      if (err || stats.hasErrors()) {
        const errors = err ? [err] : stats.compilation.errors;
        console.error(`[${
          new Date().toLocaleString()
        }] Failed to build Nebo assets with the following errors:`);
        errors.forEach((error) => console.error('          ', error.message));
        process.exit(1);
      } else {
        const builtAssets = [...stats.compilation.assetsInfo.keys()];
        stats.compilation.warnings.map((warning) => console.warn('[WARN]', warning.message));
        console.log(`[${
          new Date().toLocaleString()
        }] Successfully built ${builtAssets.length} file${builtAssets.length === 1 ? '' : 's'}: ${
          builtAssets.map((asset) => (join(publicPath, asset))).join(', ')
        }`);
      }
    });
  }

  buildConfig({
    isDevelopment,
    configPath,
    publicPath,
    globalStylesPath,
    modifyConfigWithUserConfiguration,
  }) {
    const config = Compiler.buildConfig({
      isDevelopment,
      configPath,
      publicPath: resolve(publicPath),
      globalStylesPath,
      modifyConfigWithUserConfiguration,
    });

    config.mode = isDevelopment ? 'development' : 'production';
    config.optimization = {};

    return config;
  }
}

Watcher.allowedOptions = {
  ...Compiler.allowedOptions,
};

module.exports = new Watcher();
module.exports.command = 'watch';
