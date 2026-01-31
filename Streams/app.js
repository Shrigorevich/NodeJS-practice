process.title = 'node-streams-test';

// Time 21s
// CPU 13%
// RAM 33 mb
// import fs from "node:fs/promises";
// console.time("test");

// const fd = await fs.open("./test.txt", "w");
// for (let i = 0; i < 100_000_0; i++) {
//   await fd.write(` ${i} `);
// }
// await fd.close();
// console.timeEnd("test");
// -------------------------

// Time 3.5s
// CPU 13%
// RAM 33 mb
// import fs from "node:fs"
// console.time("test")

// fs.open("./test.txt", "w", (err, fd) => {
//     for (let i = 0; i < 200_000_0; i++) {
//         fs.writeSync(fd, ` ${i} `);
//     }
//     console.timeEnd("test")
// })
// -------------------------

// NOT A GOOD PRACTICE
// 0.6s
// import fs from "node:fs/promises";

// console.time("test");

// const fd = await fs.open("./test.txt", "w");
// const stream = fd.createWriteStream();

// for (let i = 0; i < 1_000_000; i++) {
//   stream.write(Buffer.from(` ${i} `, "utf-8"));
// }

// console.timeEnd("test");
// -------------------------

// Solution with Promise
// import fs from "node:fs/promises";

// class Signal {
//   constructor() {
//     this.reset();
//   }

//   wait() {
//     return this.promise;
//   }

//   release() {
//     this.resolve();
//     this.reset();
//   }

//   reset() {
//     this.promise = new Promise(res => {
//       this.resolve = res;
//     })
//   }
// }

// (async () => {
//   console.time("test");
//   const signal = new Signal();
//   const fd = await fs.open("./test.txt", "w");
//   const stream = fd.createWriteStream();

//   stream.on("drain", () => {
//     console.log("drain event emitted");
//     signal.release();
//   });

//   // stream.writableHighWaterMark == 16384 bytes(16 KB) by default
//   for (let i = 0; i < 5_000_00; i++) {
//     const hasSpace = stream.write(Buffer.from(` ${i} `, "utf-8"));
//     if (!hasSpace) {
//       await signal.wait();
//     }
//   }

//   console.log("end")
//   stream.end();
//   fd.close();
//   console.timeEnd("test");
// })();
// -------------------------

// EventEmitter solution
// import fs from "node:fs/promises";
// import { EventEmitter } from "events"

// (async () => {
//   console.time("test");
//   const signal = new EventEmitter();
//   const fd = await fs.open("./test.txt", "w");
//   const stream = fd.createWriteStream();

//   stream.on("drain", () => {
//     signal.emit("release")
//   });

//   // stream.writableHighWaterMark == 16384 bytes(16 KB) by default
//   for (let i = 0; i < 100_000_000; i++) {
//     const hasSpace = stream.write(Buffer.from(` ${i} `, "utf-8"));
//     if (!hasSpace) {
//       await new Promise(res => {
//         signal.once("release", res)
//       })
//     }
//   }

//   stream.end();
//   fd.close();
//   console.timeEnd("test");
// })();
// -------------------------


// Separate function solution
import fs from "node:fs/promises";

(async () => {
  let drainCounter = 0;
  console.time("test");
  const fd = await fs.open("./test.txt", "w");
  const stream = fd.createWriteStream();
  let i = 0;
  const N = 10_000_000;
  // stream.writableHighWaterMark == 16384 bytes(16 KB) by default
  const writeMany = () => {
    while (i < N) {
      i++;
      
      if(i === N - 1) {
        stream.end(Buffer.from(` ${i} `, "utf-8"));
        return;
      } 
      if(!stream.write(Buffer.from(` ${i} `, "utf-8"))) return;
    }
  }

  stream.on("drain", () => {
    drainCounter++;
    console.log("Draining!!!" + " " + drainCounter)
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("test")
    fd.close();
  })

  writeMany();
})();
