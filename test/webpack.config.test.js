'use strict'

module.exports = {

  mode: 'production',

  entry: {
    test: [
      './test/test_.js'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js?/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  output: {
    // library: 'redux-sessionstorage-simple',
    // libraryTarget: 'umd',
    filename: '[name].js',
    path: __dirname
  }

}

