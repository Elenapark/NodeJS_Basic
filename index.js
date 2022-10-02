const fs = require("fs");
const path = require("path");

// 파일 읽기
fs.readFile(
  path.join(__dirname, "files", "starter.txt"),
  "utf8",
  (err, data) => {
    if (err) throw err;
    // console.log(data.toString());
    console.log(`${data} 읽기 성공`);
  }
);

console.log("내가 제일 먼저 콘솔에 찍힙니당");

// 아래는 비동기 코드를 동기적으로 실행하지만, 동시에 콜백 헬을 발생시키고 있음.

// 파일 생성
fs.writeFile(
  path.join(__dirname, "files", "reply.txt"),
  "만나서 반가워",
  (err) => {
    if (err) throw err;
    console.log(`write 성공!`);
    // 파일이 없는 경우 파일 생성 + 이미 있으면 컨텐츠를 매번 append
    fs.appendFile(
      path.join(__dirname, "files", "reply.txt"),
      "\n\nreply.txt에서 append 테스트중",
      (err) => {
        if (err) throw err;
        console.log(`append 성공!`);
        // 파일명 변경
        fs.rename(
          path.join(__dirname, "files", "reply.txt"),
          path.join(__dirname, "files", "renamedReply.txt"),
          (err) => {
            if (err) throw err;
            console.log(`rename 성공!`);
          }
        );
      }
    );
  }
);

// exit on uncaught errors
process.on("uncaughtException", (err) => {
  console.log(`There was an uncaught error: ${err}`);
  process.exit(1);
});
