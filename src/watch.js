const { resolve, join } = require('path');
const webpack = require('webpack');
const Compiler = require('./build');
const defaults = require('./defaults');

class Watcher {
  constructor({ logger = console } = {}) {
    this.logger = logger;
  }

  run(options) {
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

    this.logger.log('Nebo is watching for changes...');
    webpack(config).watch({
      ignored: ['**/node_modules'],
    }, (err, stats) => {
      if (err || stats.hasErrors()) {
        const errors = err ? [err] : stats.compilation.errors;
        this.logger.error(`[${
          new Date().toLocaleString()
        }] Failed to build Nebo assets with the following errors:`);
        errors.forEach((error) => this.logger.error('          ', error.message));
      } else {
        const builtAssets = [...stats.compilation.assetsInfo.keys()];
        stats.compilation.warnings.map((warning) => this.logger.warn('[WARN]', warning.message));
        this.logger.log(`[${
          new Date().toLocaleString()
        }] Successfully built ${builtAssets.length} file${builtAssets.length === 1 ? '' : 's'}:
          ${builtAssets.map((asset) => (join(publicPath, asset))).join('\n          ')}
        `.trim());
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
    const config = Compiler.singleton.buildConfig({
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

module.exports = { singleton: new Watcher(), Watcher };
module.exports.command = 'watch';
module.allowedOptions = { ...Compiler.allowedOptions };
