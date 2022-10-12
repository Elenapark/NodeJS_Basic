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
      1. 301 redirect
      2. 404 not found - serve 404.html file
         })로 서버 정의
4. 3번에서 만든 server가 _request를 listen할 수 있도록_ 파일의 맨 밑에서 server.listen(PORT) line을 설정

> request 및 error 로깅

5. event core 모듈과 logEvents 커스텀 모듈을 이용하여 로깅 작업
   1. reqLog.txt - 요청받은 req의 url, method, 요청 시간 등을 로깅
   2. errLog.txt - file serve 시 발생하는 error의 내용을 로깅

## Chapter 6: Intro to Express JS framework

> Node.js to Express.js

1. express.js를 이용한 서버 생성
2. get 메서드를 이용하여 요청 url에 적합한 파일 제공 or 특정 url로 redirect 등 가능
3. get 메서드의 콜백함수 내 next 인자를 이용하여 라우팅 체이닝 가능

## Chapter 7: Middleware

> What is Middleware ?

- Anything between the _Request_ and _Response_ !!

> Built-in middlewares

1. express.urlencoded() : form data 를 핸들링하는 빌트인 미들웨어
2. express.json() : json data 를 핸들링하는 빌트인 미들웨어
3. express.static() : 정적인 파일들을 핸들링하는 빌트인 미들웨어

> Custom middleware

1. 리퀘스트 로깅 미들웨어 : 파일의 가장 top level에서 선언
2. 에러 로깅 미들웨어

> Third party middleware

1. cors : 다른 사이트에서 나의 서버에 request를 보내는 것을 허가하도록 하는 써드파티 미들웨어
   1. 모든 사이트에 제한 없이 허가 - app.use(cors());
   2. 모든 사이트가 아닌 특정 도메인에서만 request 보내는 것을 허가 - 허용할 도메인 주소를 app.use(cors(corsOptions))로 전달하도록 함

## Chapter 8: Routing

> 하위 디렉토리 라우팅 설정

1. app.use('/subdir', require('./routes/subdir'))=> /subdir로 접근하는 경우 routes 폴더 내 subdir 폴더를 읽을 것을 설정

> /employees로 접근하는 경우의 라우팅 설정

1. router.router('/').get().post().put().delete()의 체이닝을 통해 같은 주소이지만 서로 다른 http메서드로 접근하는 경우의 개별 응답값을 설정
2. thunder client 익스텐션 사용하여 api 테스닝 => vs code 내에서 postman과 같은 api test 역할을 하는 익스텐션

## Chapter 9: MVC Rest API

> MVC pattern : Model - View - Controller

1. express.js is an unopinionated framework -> 사용자가 원하는대로 프로젝트를 오거나이징 할 수 있음

2. MVC 패턴으로 변경하기 및 코드 클린업
   1. data dir -> model dir
   2. controllers - employeesControlles: routes dir - api - employees.js 내 분산되어있던 각 http메서드에 대한 로직을 분리하여 컨트롤러 단에서 관리
   3. server.js에서 필요없는 코드 정리 및 분리

## Chapter 10: Authentication

1. 회원가입 시뮬레이션 : registerControllers - register routes - users model 이용

   - **bcrypt.hash** 함수를 이용하여 유저가 회원가입 시 입력하는 비밀번호를 암호화 시켜 데이터베이스에 저장함. const hashedPwd = await bcrypt.hash(pwd, 10);

2. 로그인 코드 시뮬레이션 : authControllers - auth routes - users model 이용

   - **bcrypt.compare**함수로 유저가 로그인 시 입력한 비밀번호와 기존에 가입한 비밀번호를 비교하여 match되는 경우 JWT 토큰을 발행하면서 로그인을 성공시킴

3. 사용한 HTTP method
   - 200, 201, 400, 401, 409, 500

## Chapter 11: JWT Auth

> JWT ? JSON Web Tokens

- A form of user identification that is issued after the initial user authentication takes place

> Hazards: XSS / CSRF Attacks

1. XSS : Cross Site Scripting
2. CSRF : CS Request Forgery

> what happens When user logs in?

1. 유저가 로그인에 성공하면 Access Token, Refresh Token을 응답 값으로 받는다.

   1. Access Token: 보통 5~15분의 짧은 유효기간을 가짐
   2. Refresh Token: 보통 몇시간~ 며칠의 다소 긴 유효기간을 가짐

2. API는 클라이언트 단과 **액세스 토큰**을 JSON 데이터로 주고 / 받는다.

   1. 클라이언트 단에서는 XSS / CSRF 공격을 피하기 위해 _메모리_ 에만 액세스 토큰을 저장하는게 권장된다. (클라이언트 앱 내 state를 의미)
      => APP이 종료되면 자동으로 토큰이 사라질 수 있으므로
   2. 로컬스토리지 또는 쿠키에 액세스 토큰을 저장하지 않는다 !

3. API는 클라이언트 단에 **리프레시 토큰** 을 httpOnly cookie로 전송한다.
   1. 이 쿠키는 Javascript를 이용해서 접근할 수 없다.
   2. 리프레시 토큰은 반드시 만료기한을 가져야 한다. => 그래야 유저가 다시 로그인을 시도하는 과정이 있으므로
   3. 리프레시 토큰은 새로운 리프레시 토큰을 생성할 수 없어야 한다. => 그래야 리프레시 토큰이 탈취당하더라도 indefinte access를 막을 수 있다

> Access Token

1. Issued at User Authorization stage
2. Client uses for API Access/Request (protected routes) until expires
3. API verify the access token with Middleware everytime the access token is used
4. When the access token expires, user will need to send their refresh token to the API's refresh endpoint to get a new access token!

> Refresh Token

1. Issued at User Authorization stage as well
2. Client uses to get a new Access Token
3. API verify the refresh token received from user and cross-reference the refresh token in our database too
4. Storing a reference to the refresh token in the database will allow refresh tokens to be terminated early when user logs out
5. Must be allowed to expire or logout So indefinte access cannot be gained!

> how to randomly make access_token_secret / refresh_token_secret to use when make jwt token

1. require('crypto').randomBytes(64).toString('hex')
2. add randomly generated secret to .env file

> few setCookie/clearCookie properties

1. httpOnly: true
   - refresh token은 httpOnly cookie로 전송해야 보안에 유리하다.
   - JavaScript 코드로 (ex.Document.cookie) 쿠키에 접근하는 것을 막으며 XSS 공격을 경감시킨다.
2. sameSite : None/Lax/Strict
   - 기본적으로 쿠키는 대상 도메인 기준으로 포함 전송 유무가 판단됨.
   1. None: same site 검증 x : a -> b 사이트로 요청이 있을 시 b사이트의 쿠키가 붙어서 전송됨.
   2. Lax: same site 검증 o : 허용된 몇개의 패턴 이외에는 same site가 아니면 쿠키를 전송하지 않도록 강제하는 _디폴트_ 쿠키 정책.
   3. Strict : same site인지 엄격하게 검증 : 소스가 되는 도메인과 대상 도메인이 일치하는 경우에만 쿠키가 붙어서 전송됨. google.com => google.com (o) / naver.com => google.com (x)
3. secure : true
   - Indicates that the cookie is sent to the server only when a request is made with the https: scheme (except on localhost),
4. maxAge :cookie가 만료될때까지의 시간(초) 설정

## Chapter 12: User Roles

> Authentication (인증)

- 유저의 identification을 확인하는 절차 (로그인 과정)
- ex) When we log in with the username and password, we are verifying who we are, and this is considered to be authentication.

> Authorization (인가)

- 로그인 이후 유저가 API 요청 시 어떠한 리소스까지 접근할 수 있는 유저인지 확인하는 절차
- ex) After logging in, API issues users JWT tokens.
  - it's true that the tokens confirm the authentication process
  - these tokens also allow access to our api endpoints which allow our api data. this is authorization.
