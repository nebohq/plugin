const webpack = require('webpack');
const { join, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const defaults = require('./defaults');

class Compiler {
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

    this.logger.log('Building Nebo...');

    return new Promise((resolvePromise, reject) => {
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          const errors = err ? [err] : stats.compilation.errors;
          const errorMessage = `
            Failed to build Nebo assets with the following errors:
            ${errors.map((error) => error.message).join('\n          ')}
          `.trim();
          this.logger.error(errorMessage);
          reject(new Error(errorMessage));
          process.exit(1);
        } else {
          const builtAssets = [...stats.compilation.assetsInfo.keys()];
          stats.compilation.warnings.map((warning) => this.logger.warn('[WARN]', warning.message));
          this.logger.log(`
            Successfully built ${builtAssets.length} file${builtAssets.length === 1 ? '' : 's'}:
            ${builtAssets.map((asset) => (join(publicPath, asset))).join('\n          ')}
          `.trim());
          resolvePromise(stats);
        }
      });
    });
  }

  buildConfig({
    configPath, globalStylesPath, publicPath, isDevelopment, modifyConfigWithUserConfiguration,
  }) {
    return modifyConfigWithUserConfiguration({
      entry: {
        'nebo-config': [
          configPath,
          ...globalStylesPath,
        ].filter(Boolean),
      },
      output: {
        path: publicPath,
        filename: 'nebo.js',
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'nebo.css',
        }),
      ],
      module: {
        rules: [
          {
            test: /\.m?js(x)?$/,
            exclude: /node_modules/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { loose: true }],
                  '@babel/preset-react',
                ],
              },
            }],
          },
          {
            test: /\.module\.s(a|c)ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap: isDevelopment,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDevelopment,
                },
              },
            ],
          },
          {
            test: /\.s(a|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDevelopment,
                },
              },
            ],
          },
          {
            test: /\.module\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap: isDevelopment,
                },
              },
            ],
          },
          {
            test: /\.css$/,
            exclude: /\.module.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
            ],
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx', '.scss', '.sass'],
      },
      mode: 'production',
      performance: {
        hints: false,
      },
      optimization: {
        minimizer: [new TerserPlugin({ extractComments: false })],
      },
    });
  }
}

module.exports = { singleton: new Compiler(), Compiler };
module.exports.command = 'build';
module.exports.allowedOptions = {
  '--config-path': 'configPath',
  '--public-path': 'publicPath',
  '--global-styles-path': 'globalStylesPath',
};
