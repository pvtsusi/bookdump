const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const config = {
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    filename: 'static/js/bundle.[contenthash:8].js',
    path: path.resolve(__dirname, 'build')
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!bundle.js*', '!root', '!root/*', '!redis', '!redis/*']
    })
  ]
};

module.exports = merge(baseConfig, config);
