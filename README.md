# NodeJS_Basic

## Chapter1 : Start

> NodeJS는 VanillaJS와 어떻게 다를까?

1.  Node runs on a server - not in a browser
2.  The console is the terminal window
3.  Global object instead of window object
4.  Has common core modules
5.  CommonJS modules instead of ES6 modules
6.  Missing some JS apis like fetch api

## Chapter2 : Read and Write Files

> File 모듈을 이용한 파일 읽기/쓰기/수정

1. fs.readFile : 파일 읽기
2. fs.writeFile : 파일 쓰기
3. fs.appendFile : 파일 쓰기 + 추가
4. fs.rename : 파일명 변경

> 비동기코드의 동기화

1. using callback
2. using async-await with fsPromises

> 용량이 큰 파일을 읽거나 수정할때, to grab bucket by bucket is better than to grab all at once

1. fs.createReadStream
2. fs.createWriteStream

> 디렉토리 생성/삭제

1. fs.existsSync : 디렉토리 존재여부 확인
2. fs.mkdir : 디렉토리 생성
3. fs.rmdir : 디렉토리 삭제

## Chapter3 : NPM Modules

> NPM Module와 Node common core modules

1. NPM : node modules that are created by third parties (by other developers)
2. npm i nodemon -g :
   1. install a package _globally_
   2. nodemon monitors and automatically restarts server when changes occur
3. npm init : initialize npm just for _my project_ -> generates package.json file

> package.json

1. 특정 프로젝트에서 사용하고있는 npm 패키지들을 명세하고있는 파일
2. npm패키지를 다운받으면 용량이 큰 node_modules 폴더가 생기는데 이를 github에 그대로 올리지 않고(.gitignore 파일을 이용), 해당 패키지명을 명시한 package.json만을 이용하여 npm install 명령어로 유관 패키지 모듈들을 다운로드받아 프로젝트를 셋업할 수 있음.

## Chapter4 : Event Emitter

1. logEvents.js 커스텀 모듈 생성
2. events common core 모듈을 이용하여 log Event를 listen / emit 구현
   1. fs.appendFile은 존재하지 않는 file의 경우 생성하면서 컨텐츠를 append하지만 dir의 경우에는 해당되지 않으므로 미리 특정 dir 내부에서 appendFile 메서드를 사용하는 경우 해당 dir가 이미 존재하는지 여부에 따라 fs.mkdir / fs.rmdir로 dir 상태를 컨트롤 후에 사용해야 한다!

## Chapter 5: Build a Web Server

> common core modules 및 port 설정

1. http, path, fs, fsPromises module 사용
2. port 설정 : 특정 호스팅 서버가 있을 경우 process.env.PORT, 여기서는 3500으로 설정

> http.createServer를 이용하여 server 생성

3. http.createServer((req, res) => {
   1. req.url의 extname에 따른 contentType 설정
   2. 설정한 contentType과 req.url에 따라 serve할 file의 filePath 설정
   3. fs에 2번에서 설정한 filePath가 있는 경우(즉 요청한 파일이 있는 경우)
      1. 200 ok - serve file
         - contentType에 image가 포함된 경우 'utf-8'형식 제거
         - contentType이 application/json인 경우 JSON.parse후 JSON.stringify한 data로 serve
         - response.writeHead : filePath가 404.html인 경우 404로 설정, 그 외는 200
   4. fs에 2번에서 설정한 filePath가 없는 경우(즉 요청한 파일이 없는 경우)
   5. 301 redirect
   6. 404 not found - serve 404.html file
      })로 서버 정의
4. 3번에서 만든 server가 _request를 listen할 수 있도록_ 파일의 맨 밑에서 server.listen(PORT) line을 설정

> request 및 error 로깅

5. event core 모듈과 logEvents 커스텀 모듈을 이용하여 로깅 작업
   1. reqLog.txt - 요청받은 req의 url, method, 요청 시간 등을 로깅
   2. errLog.txt - file serve 시 발생하는 error의 내용을 로깅
