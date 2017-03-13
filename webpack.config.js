var path = require('path');

module.exports = {
  devtool: "sourcemap",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "./build"),
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  }
}
