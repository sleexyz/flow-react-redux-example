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
    path: path.resolve(__dirname, 'dist'),
    filename: './generated/bundle.js',
    publicPath: '/',
  },
};
