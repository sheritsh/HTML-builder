const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const dirPath = path.resolve(__dirname, 'files');

fs.rm(path.resolve(__dirname, 'files-copy'), { recursive: true, force: true }, (err) => {
  if (err) throw err;

  fs.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(
            path.resolve(__dirname, 'files', file.name),
            path.resolve(__dirname, 'files-copy', file.name),
            (err) => {
              if (err) throw err;
            }
          );
        }
      });
      stdout.write('All files copied successfully\n');
    });
  });
});
