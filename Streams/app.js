
// Time 21s
// CPU 13%
// RAM 33 mb
// import fs from 'node:fs/promises'
// console.time("test")

// const fd = await fs.open("./test.txt", "w")
// for (let i = 0; i < 100_000_0; i++) {
//     await fd.write(` ${i} `);
// }
// await fd.close();
// console.timeEnd("test")


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

// NOT A GOOD PRACTICE
// 0.6s
import fs from "node:fs/promises"

console.time("test")

const fd = await fs.open("./test.txt", "w");
const stream = fd.createWriteStream();

for (let i = 0; i < 1_000_000; i++) {
    stream.write(Buffer.from(` ${i} `, "utf-8"))
}

console.timeEnd("test")



