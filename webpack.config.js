const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

const modeMap = {
  stage: 'production',
  production: 'production',
};

module.exports = {
  entry: slsw.lib.entries,
  mode: modeMap[process.env.NODE_ENV] || 'development',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
};
