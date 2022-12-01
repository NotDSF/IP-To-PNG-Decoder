const { existsSync, readFileSync } = require("fs");
const { PNG } = require("pngjs");
const path = process.argv[2];

if (!path) {
    console.log("Usage: node . [path]");
    process.exit(1);
}

if (!existsSync(path)) {
    console.log(`Couldn't locate image: ${path}`);
    process.exit(1);
}

if (path.split(".").pop() != "png") {
    console.log("Only PNG's are supported!");
    process.exit(1);
}

const { height, width, data } = PNG.sync.read(readFileSync(path));
const colorValues = {
    "255,0,0": 0,
    "0,255,0": 1,
    "0,0,255": 2,
    "255,255,0": 3
}

const bytes = [0, 0, 0, 0]

const heightUnit = height / 4
const widthUnit = width / 4

for (let y = heightUnit - 1; y <= height; y += heightUnit) {
    for (let x = widthUnit - 1; x <= width; x += widthUnit) {
        const idx = (width * y + x) << 2;
        const rgb = `${ data[idx] },${ data[idx + 1] },${ data[idx + 2] }`

        bytes[(y + 1) / heightUnit - 1] += (4 ** ((x + 1) / widthUnit - 1)) * colorValues[rgb]
    }
}

console.log(`IP is: ${bytes.join(".")}`);
