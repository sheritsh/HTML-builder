const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');

const readableStream = fs.createReadStream(path.resolve(__dirname, './text.txt'));
readableStream.on('data', (chunk) => stdout.write(chunk));
readableStream.on('error', (err) => stderr.write(err.message));
