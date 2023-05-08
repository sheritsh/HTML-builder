const path = require('path');
const fs = require('fs');
const { stdout, stderr } = require('process');

const dirPath = path.resolve(__dirname, 'secret-folder');
const options = { withFileTypes: true };

fs.readdir(dirPath, options, (err, files) => {
  if (err) {
    stderr.write('Error: ' + err.message);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.resolve(dirPath, file.name);
        fs.stat(filePath, (err, stat) => {
          if (err) {
            stderr.write('Error: ' + err.message);
          } else {
            const pwd = path.basename(filePath).split('/');
            const fileName = pwd[pwd.length - 1];
            const fileExt = path.extname(filePath).slice(1);
            const fileSizeStr = stat['size'] + ' bytes';
            stdout.write(fileName + ' - ' + fileExt + ' - ' + fileSizeStr + '\n');
          }
        });
      }
    });
  }
});
