import { readdir, readFile } from "node:fs/promises";

const SOF_MARKERS = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function jpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (SOF_MARKERS.has(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error("no SOF marker");
}

const names = (await readdir("public/photos"))
  .filter((name) => name.endsWith(".jpg"))
  .toSorted();

const rows = await Promise.all(
  names.map(async (name) => {
    const buffer = await readFile(`public/photos/${name}`);
    const { width, height } = jpegSize(buffer);
    return `${name.padEnd(24)} ${width}x${height}  ${Math.round(buffer.length / 1024)} KB`;
  }),
);

for (const row of rows) console.log(row);
