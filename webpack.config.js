const path = require("webpack")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: '/dist',
    filename: '[name].js',
    publicPath: '/',
  },
}