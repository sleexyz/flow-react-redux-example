const webpack = require('webpack');
const path = require('path');

module.exports = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js',
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8081,
    contentBase: "./dist"
  },

  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: __dirname,
    filename: './dist/bundle.js',
    publicPath: '/',
  },
};
