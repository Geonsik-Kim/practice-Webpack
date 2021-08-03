# practice-Webpack
Webpack 기본 학습을 위한 저장소<br>
'참고'에 있는 영상과 블로그를 따라서 진행하였습니다.

## 참고
프론트엔드 개발환경의 이해: 웹팩(기본) - 김정환<br>
[영상](https://youtu.be/bBYrpK5gjk0) : 엔트리/아웃풋/로더<br>
[영상](https://youtu.be/dqYH3EdB-Vs) : 플러그인<br>
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
모든 옵션을 Webpack 설정 파일로 옮겼기 때문에 단순히 webpack 명령어만 실행한다. 이제부터는 npm run build로 웹팩 작업을 지시할 수 있다.
<br><br>
## 2. 로더
Webpack은 모든 파일을 모듈로 바라본다. 자바스크립트로 만든 모듈 뿐만아니라 스타일시트, 이미지, 폰트까지도 전부 모듈로 보기 때문에 import 구문을 사용하면 자바스크립트 코드 안으로 가져올수 있다.<br>

이것이 가능한 이유는 웹팩의 <strong>로더</strong> 덕분이다. 로더는 타입스크립트 같은 다른 언어를 자바스크립트 문법으로 변환해 주거나 이미지를 data URL 형식의 문자열로 변환한다. 뿐만아니라 CSS 파일을 자바스크립트에서 직접 로딩할수 있도록 해준다.

### 2.1 커스텀 로더 만들기

```
// myloader.js
module.exports = function myloader(content) {
  console.log("myloader가 동작함")
  return content
}
```
함수로 만들수 있는데 로더가 읽은 파일의 내용이 함수 인자 content로 전달된다. 로더가 동작하는지 확인하는 용도로 로그만 찍고 곧장 content를 돌려 준다.<br>

로더를 사용하려면 웹팩 설정파일의 module 객체에 추가한다.
```
// webpack.config.js:
module: {
  rules: [{
    test: /\.js$/, // .js 확장자로 끝나는 모든 파일
    use: [path.resolve('./myloader.js')] // 방금 만든 로더를 적용한다
  }],
}
```
* module.rules 배열에 모듈을 추가하는데 test와 use로 구성된 객체를 전달한다.
* test에는 로딩에 적용할 파일을 지정한다. 파일명 뿐만아니라 파일 패턴을 정규표현식으로 지정할수 있는데 위 코드는 .js 확장자를 갖는 모든 파일을 처리하겠다는 의미다.
* use에는 이 패턴에 해당하는 파일에 적용할 로더를 설정하는 부분이다. 방금 만든 myloader 함수의 경로를 지정한다.

### 2.2 자주 사용하는 로더
#### 2.2.1 css-loader
Webpack은 모든것을 모듈로 바라보기 때문에 자바스크립트 뿐만 아니라 스타일시트로 import 구문으로 불러 올 수 있다.
```
// app.js:

import "./style.css"
```
```
//style.css:

body {
  background-color: green;
}
```
CSS 파일을 자바스크립트에서 불러와 사용하려면 CSS를 모듈로 변환하는 작업이 필요하다.<br>
css-loader가 그러한 역할을 하는데 우리 코드에서 CSS 파일을 모듈처럼 불러와 사용할 수 있게끔 해준다.<br>

먼저 로더를 설치 한다.
```
npm install -D css-loader
```

Webpack 설정에 로더를 추가한다.
```
//webpack.config.js:

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // .css 확장자로 끝나는 모든 파일
        use: ["css-loader"], // css-loader를 적용한다
      },
    ],
  },
}
```
Webpack은 엔트리 포인트부터 시작해서 모듈을 검색하다가 CSS 파일을 찾으면 css-loader로 처리할 것이다.<br>
use.loader에 로더 경로를 설정하는 대신 배열에 로더 이름을 문자열로 전달해도 된다.

#### 2.2.2 style-loader
모듈로 변경된 스타일 시트는 돔에 추가되어야만 브라우져가 해석할 수 있다. css-loader로 처리하면 자바스크립트 코드로만 변경되었을 뿐 돔에 적용되지 않았기 때문에 스트일이 적용되지 않았다.<br>

style-loader는 자바스크립트로 변경된 스타일을 동적으로 돔에 추가하는 로더이다. CSS를 번들링하기 위해서는 css-loader와 style-loader를 함께 사용한다.<br>

먼저 스타일 로더를 다운로드 한다.
```
npm install -D style-loader
```
그리고 Webpack 설정에 로더를 추가한다.
```
//package.json:

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // style-loader를 앞에 추가한다
      },
    ],
  },
}
```
배열로 설정하면 뒤에서부터 앞으로 순서대로 로더가 동작한다.<br>
위 설정은 모든 .css 확장자로 끝나는 모듈을 읽어 들여 css-loader를 적용하고 그 다음 style-loader를 적용한다.

#### 2.2.3 file-loader
CSS 뿐만 아니라 소스코드에서 사용하는 모든 파일을 모듈로 사용하게끔 할 수 있다.<br>
파일을 모듈 형태로 지원하고 웹팩 아웃풋에 파일을 옮겨주는 것이 file-loader가 하는 일이다.<br>
가령 CSS에서 url() 함수에 이미지 파일 경로를 지정할 수 있는데 웹팩은 file-loader를 이용해서 이 파일을 처리한다.
```
//style.css:

body {
  background-image: url(bg.png);
}
```
배경 이미지를 bg.png 파일로 지정했다.<br>

Webpack은 엔트리 포인트인 app.js가 로딩하는 style.css 파일을 읽을 것이다.<br>
그리고 이 스타일시트는 url() 함수로 bg.png를 사용하는데 이때 로더를 동작시킨다.
```
//webpack.config.js:

module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/, // .png 확장자로 마치는 모든 파일
        loader: "file-loader", // 파일 로더를 적용한다
      },
    ],
  },
}
```
Webpack이 .png 파일을 발견하면 file-loader를 실행할 것이다. 로더가 동작하고 나면 아웃풋에 설정한 경로로 이미지 파일을 복사된다. 파일명은 해쉬코드로 변경 된다. 캐시 갱신을 위한 처리로 보인다.<br><br>
하지만 이대로 index.html 파일을 브라우져에 로딩하면 이미지를 제대로 로딩하지 못할 것이다. CSS를 로딩하면 background-image: url(bg.png) 코드에 의해 동일 폴더에서 이미지를 찾으려고 시도할 것이다. 그러나 웹팩으로 빌드한 이미지 파일은 output인 dist 폴더 아래로 이동했기 때문에 이미지 로딩에 실패할 것이다.<br>

file-loader 옵션을 조정해서 경로를 바로 잡아 주어야 한다.
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/, // .png 확장자로 마치는 모든 파일
        loader: "file-loader",
        options: {
          publicPath: "./dist/", // prefix를 아웃풋 경로로 지정
          name: "[name].[ext]?[hash]", // 파일명 형식
        },
      },
    ],
  },
}
```

publicPath 옵션은 file-loader가 처리하는 파일을 모듈로 사용할 때 경로 앞에 추가되는 문자열이다.<br>
output에 설정한 'dist' 폴더에 이미지 파일을 옮길 것이므로 publicPath 값을 이것으로로 지정했다.<br>
파일을 사용하는 측에서는 'bg.png'를 'dist/bg.png'로 변경하여 사용할 것이다.<br>

또한 name 옵션을 사용했는데 이것은 로더가 파일을 아웃풋에 복사할때 사용하는 파일 이름이다. 기본적으로 설정된 해쉬값을 쿼리스트링으로 옮겨서 'bg.png?6453a9c65953c5c28aa2130dd437bbde' 형식으로 파일을 요청하도록 변경했다.

#### 2.2.4 url-loader
사용하는 이미지 갯수가 많다면 네트웍 리소스를 사용하는 부담이 있고 사이트 성능에 영향을 줄 수도 있다.<br>
만약 한 페이지에서 작은 이미지를 여러 개 사용한다면 Data URI Scheme을 이용하는 방법이 더 나은 경우도 있다.<br>
이미지를 Base64로 인코딩하여 문자열 형태로 소스코드에 넣는 형식이다.<br>

url-loader는 이러한 처리를 자동화해준다.<br>

먼저 로더를 설치한다.
```
npm install -D url-loader
```
그리고 웹팩 설정을 추가한다.
```
//webpack.config.js:

{
  test: /\.png$/,
  use: {
    loader: 'url-loader', // url 로더를 설정한다
    options: {
      publicPath: './dist/', // file-loader와 동일
      name: '[name].[ext]?[hash]', // file-loader와 동일
      limit: 5000 // 5kb 미만 파일만 data url로 처리
    }
  }
}
```

file-loader와 옵션 설정이 거의 비슷하고 마지막 limit 속성만 추가했다.<br>
모듈로 사용한 파일중 크기가 5kb 미만인 파일만 url-loader를 적용하는 설정이다.<br>
만약 이보다 크면 file-loader가 처리하는데 옵션 중 fallback 기본값이 file-loader이기 때문이다.<br>

빌드 결과를 보면 small.png 파일이 문자열로 변경되어 있는 것을 확인 할 수 있다.<br>
반면 5kb 이상인 bg.png는 여전히 파일로 존재한다.