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
const colors = [];
let rows = [];

for (let y=height / 4 - 1; y <= height; y += height / 4) {
    for (let x=width / 4 - 1; x <= width; x += width / 4) {
        const idx = (width * y + x) << 2;
        colors.push([data[idx], data[idx + 1], data[idx + 2]].join());
    }
}

for (let i=0; i < colors.length; i += 4) {
    rows.push(colors.slice(i, i + 4).map(rgb => {
        switch (rgb) {
            case "255,0,0":
                return 0; // red
            case "0,255,0":
                return 1; // green
            case "0,0,255":
                return 2; // blue
            case "255,255,0":
                return 3; // yellow
        }
    }));
}

rows = rows.map((row) => {
    let total = 0;
    row.forEach((v, i) => total += (4 ** i) * v);
    return total;
});

console.log(`IP is: ${rows.join(".")}`);