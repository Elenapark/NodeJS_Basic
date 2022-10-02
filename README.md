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
