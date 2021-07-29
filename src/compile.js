const webpack = require('webpack');
const { basename } = require('path');
const { existsSync } = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const defaults = require('./defaults');

module.exports = function compile() {
  const {
    isDevelopment,
    configPath,
    publicPath,
    globalStylesPath,
    webpackPath,
  } = defaults.parseCompilerConfig();
  const globalStylePaths = Array.isArray(globalStylesPath) ? globalStylesPath : [globalStylesPath];

  const config = {
    entry: {
      'nebo-config': [
        configPath,
        ...globalStylePaths,
      ].filter(Boolean),
    },
    output: {
      path: publicPath,
      filename: `${basename(configPath).replace(/\.js(x)?$/, '')}.js`,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${basename(configPath).replace(/\.js(x)?$/, '')}.css`,
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
                '@babel/preset-env',
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
    optimization: {},
  };

  let configure = (defaultConfig) => defaultConfig;
  // eslint-disable-next-line global-require
  if (existsSync(webpackPath)) configure = require(webpackPath).configure;

  webpack(configure(config), (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.compilation.errors[0]);
      process.exit(1);
    }
  });
};
