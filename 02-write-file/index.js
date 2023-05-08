const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { stdout, stdin } = require('process');

function endProgram() {
  lineReader.close();
  stdout.write('Do... or Do Not. There Is No Try.\n');
}

const lineReader = createInterface(stdin, stdout);
const writeStream = fs.createWriteStream(path.resolve(__dirname, './text.txt'));

lineReader.write('May the force be with you!\nWhat wisdom do you want to keep?\n');
lineReader.on('line', (data) => {
  data === 'exit' ? endProgram() : writeStream.write(data + '\n');
});

lineReader.on('SIGINT', () => endProgram());
