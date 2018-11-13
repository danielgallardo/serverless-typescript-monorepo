const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  optimization: {
    // Do not minimize the code.
    minimize: false
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: __dirname,
        options: {
          // babel config should be inlined so webpack.config.js can be reused inside services
          // otherwise it will not find babel.config.js
          cacheDirectory: true,
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/proposal-class-properties',
            '@babel/proposal-object-rest-spread',
            'source-map-support'
          ],
          presets: [
            '@babel/preset-typescript',
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry',
                shippedProposals: true,
                modules: false,
                targets: {
                  node: '8.10'
                }
              }
            ]
          ]
        }
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  }
};
