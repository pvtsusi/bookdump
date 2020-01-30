const path = require('path');
const merge = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.js');

const config = {
  target: 'node',
  node: {
    __dirname: false
  },

  devtool: 'source-map',

  mode: 'development',

  entry: './src/index.js',
  externals: [webpackNodeExternals({whitelist: [/^typeface-/]})],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new CopyPlugin([
      { from: 'src/public', to: 'root' },
      { from: 'src/redis', to: 'redis' }
    ]),
  ]
};

module.exports = merge(baseConfig, config);
