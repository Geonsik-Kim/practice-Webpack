# practice-Webpack
Webpack 기본 학습을 위한 저장소<br>
'참고'에 있는 영상과 블로그를 따라서 진행하였습니다.

## 참고
프론트엔드 개발환경의 이해: 웹팩(기본) - 김정환<br>
[영상](https://youtu.be/bBYrpK5gjk0)
[블로그](https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html)
<br><br>

## 1. 엔트리/아웃풋
Webpack은 여러개 파일을 하나의 파일로 합쳐주는 번들러(bundler)다.<br>
하나의 시작점(entry point)으로부터 의존적인 모듈을 전부 찾아내서 하나의 결과물로 만들어 낸다.<br>
아래는 app.js부터 시작해 math.js 파일을 찾은 뒤 하나의 파일로 만드는 방식이다.
<br><br>
번들 작업을 하는 Webpack 패키지와 Webpack 터미널 도구인 webpack-cli를 설치한다.
```
npm install -D webpack webpack-cli
```
Webpack의 --mode, --entry, --output 세 개 옵션만 사용하면 코드를 묶을 수 있다.
```
$ node_modules/.bin/webpack --mode development --entry ./src/app.js - dist/main.js
```
* --mode는 웹팩 실행 모드를 의미하는데 개발 버전인 development를 지정한다
* --entry는 시작점 경로를 지정하는 옵션이다
* --output은 번들링 결과물을 위치할 경로다
<br><br>
Webpack의 옵션 중 --config 항목을 보자.
```
-c, --config <value...>                Provide path to a webpack configuration file e.g. ./webpack.config.js.
```
이 옵션은 Webpack 설정파일의 경로를 지정할 수 있는데 기본 파일명이 webpack.config.js이다.
<br>
```
// webpack.config.js:
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
```
웹팩 실행을 위한 NPM 커스텀 명령어를 추가한다.
```
{
  // package.json:
  "scripts": {
    "build": "./node_modules/.bin/webpack"
  }
}
```
모든 옵션을 웹팩 설정 파일로 옮겼기 때문에 단순히 webpack 명령어만 실행한다. 이제부터는 npm run build로 웹팩 작업을 지시할 수 있다.