#!/usr/bin/env node

const webpack = require('webpack');
const { basename } = require('path');
const { readFileSync, existsSync } = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  isDevelopment = process.env.NODE_ENV !== 'production',
  configPath = './src/nebo-config.js',
  publicPath = `${process.cwd()}/public`,
  globalStylesPath = null,
} = existsSync('./.neborc') ? JSON.parse(readFileSync('./.neborc')) : {};

webpack({
  entry: {
    'nebo-config': [configPath, globalStylesPath].filter(Boolean),
  },
  output: {
    path: publicPath,
    filename: [basename(configPath).split('.').slice(0, -1), '.js'].join(''),
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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass'],
  },
  optimization: {},
}, (err, stats) => {
  if (err || stats.hasErrors()) console.error(err || stats.compilation.errors);
});
