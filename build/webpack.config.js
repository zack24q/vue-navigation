var path = require('path')
var webpack = require('webpack')
var version = require("../package.json").version;

var banner =
  "/**\n" +
  " * vue-navigation v" + version + "\n" +
  " * https://github.com/zack24q/vue-navigation\n" +
  " * Released under the MIT License.\n" +
  " */\n";

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'vue-navigation.min.js',
    library: "VueNavigation",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin({banner: banner, raw: true})
  ]
}
