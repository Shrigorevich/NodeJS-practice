const { Buffer } = require("node:buffer");

const container = Buffer.alloc(5);

container[0] = 0b00000001;
container[1] = 0b11111110;

console.log(container);
