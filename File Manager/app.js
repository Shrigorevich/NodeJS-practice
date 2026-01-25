import fs from "node:fs/promises";

(async () => {
  const scheduler = new Map();
  const filePath = "./command.txt";
  const fileDescriptor = await fs.open(filePath, "r");

  fileDescriptor.on("change", async () => {
    const command = await readCommand(fileDescriptor);
    console.log(`Command: ${command}`);
  });

  const watcher = fs.watch(filePath);
  for await (const event of watcher) {
    debounceEvent(filePath, event, scheduler, fileDescriptor);
  }
})();

function debounceEvent(filePath, event, scheduler, fileDescriptor) {
  clearTimeout(scheduler.get(filePath));
  scheduler.set(
    filePath,
    setTimeout(() => {
      if (event.eventType === "change") {
        fileDescriptor.emit("change");
      }
    }, 150),
  );
}

async function readCommand(fileDescriptor) {
  const fileSize = (await fileDescriptor.stat()).size; // File size in bytes
  const buffer = Buffer.alloc(fileSize);
  const offset = 0;
  const position = 0;
  await fileDescriptor.read(buffer, offset, fileSize, position);
  return buffer.toString("utf-8");
}
