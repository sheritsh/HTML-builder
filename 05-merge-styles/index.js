const fs = require('fs');
const path = require('path');

const dirStyles = path.resolve(__dirname, 'styles');
const resCssBundle = path.resolve(__dirname, 'project-dist', 'bundle.css');

fs.open(resCssBundle, 'w', (err) => {
  if (err) throw err;
});

fs.readdir(dirStyles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.resolve(dirStyles, file.name);

      if (path.extname(filePath) === '.css') {
        fs.readFile(filePath, (err, data) => {
          if (err) throw err;
          fs.appendFile(resCssBundle, data, (err) => {
            if (err) throw err;
          });
        });
      }
    }
  });
});
