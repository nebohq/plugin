const webpack = require('webpack');
const { join, basename, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const defaults = require('./defaults');
const { Parser } = require('./options');

class Compiler {
  constructor() {
    this.optionsParser = new Parser(Compiler.allowedOptions);
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

    console.log('Building Nebo...');
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        const errors = err ? [err] : stats.compilation.errors;
        console.error('Failed to build Nebo assets with the following errors:');
        errors.forEach((error) => console.error('          ', error.message));
        process.exit(1);
      } else {
        const builtAssets = [...stats.compilation.assetsInfo.keys()];
        stats.compilation.warnings.map((warning) => console.warn('[WARN]', warning.message));
        console.log(`
          Successfully built ${builtAssets.length} file${builtAssets.length === 1 ? '' : 's'}:
          ${builtAssets.map((asset) => (join(publicPath, asset))).join('\n          ')}
        `.trim());
      }
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
        filename: 'nebo.config.js',
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'nebo.config.css',
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

Compiler.allowedOptions = {
  '--config-path': 'configPath',
  '--public-path': 'publicPath',
  '--global-styles-path': 'globalStylesPath',
};

module.exports = new Compiler();
module.exports.command = 'build';
module.exports.allowedOptions = Compiler.allowedOptions;
