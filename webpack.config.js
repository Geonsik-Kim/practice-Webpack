const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: '[name].js',
    path: path.resolve("./dist"),
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ["style-loader", "css-loader"], // style-loader를 앞에 추가한다
    },{
      test: /\.png$/,
      use: {
        loader: 'url-loader', // url 로더를 설정한다
        options: {
          publicPath: './dist/', // file-loader와 동일
          name: '[name].[ext]?[hash]', // file-loader와 동일
          limit: 5000 // 5kb 미만 파일만 data url로 처리
        }
      }
    }],
  }
}