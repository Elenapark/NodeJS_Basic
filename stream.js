// when largerfile,
// sometimes bucket by bucket is better than to grab everything all at once

const fs = require("fs");
const rs = fs.createReadStream("./files/lorem.txt", { encoding: "utf-8" });
const ws = fs.createWriteStream("./files/new-lorem.txt");

// rs.on("data", (dataChunk) => {
//   ws.write(dataChunk);
// });

rs.pipe(ws);
