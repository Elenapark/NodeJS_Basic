const fsPromises = require("fs").promises;
const path = require("path");

// 1. callback 을 이용한 비동기 코드의 동기화 - 콜백 헬을 발생시키고 있음.

// fs.writeFile(
//   path.join(__dirname, "files", "reply.txt"),
//   "만나서 반가워",
//   (err) => {
//     if (err) throw err;
//     console.log(`write 성공!`);
//     fs.appendFile(
//       path.join(__dirname, "files", "reply.txt"),
//       "\n\nreply.txt에서 append 테스트중",
//       (err) => {
//         if (err) throw err;
//         console.log(`append 성공!`);
//         fs.rename(
//           path.join(__dirname, "files", "reply.txt"),
//           path.join(__dirname, "files", "renamedReply.txt"),
//           (err) => {
//             if (err) throw err;
//             console.log(`rename 성공!`);
//           }
//         );
//       }
//     );
//   }
// );

// 2. async - await

const fileOps = async () => {
  try {
    const fsReadData = await fsPromises.readFile(
      path.join(__dirname, "files", "starter.txt"),
      "utf-8"
    );
    console.log(`fsPromises:${fsReadData}`);
    await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));
    await fsPromises.writeFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      fsReadData
    );
    await fsPromises.appendFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      "\n\n async-await로 append 다시 test중!"
    );

    await fsPromises.rename(
      path.join(__dirname, "files", "promiseWrite.txt"),
      path.join(__dirname, "files", "renamedPromiseWrite.txt")
    );

    const newData = await fsPromises.readFile(
      path.join(__dirname, "files", "renamedPromiseWrite.txt"),
      "utf-8"
    );
    console.log(`result:${newData}`);
  } catch (err) {
    console.error(err);
  }
};

fileOps();
// exit on uncaught errors
process.on("uncaughtException", (err) => {
  console.log(`There was an uncaught error: ${err}`);
  process.exit(1);
});
