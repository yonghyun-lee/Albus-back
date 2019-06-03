
const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/server.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  target: 'node',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.json' ],
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json"})
    ],
    modules: [
      path.resolve('src'),
      'node_modules'
    ],
    alias: {
      'pg-native': path.join(__dirname, 'alias/pg-native.js'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};