const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, 'project-dist', 'index.html');
const distDir = path.resolve(__dirname, 'project-dist');
const stylesDir = path.resolve(__dirname, 'styles');
const cssBundle = path.resolve(__dirname, 'project-dist', 'style.css');
const assetsDir = path.resolve(__dirname, 'project-dist', 'assets');

fs.mkdir(distDir, { recursive: true }, (err) => {
  // make index.html and style.css
  if (err) throw err;
  fs.open(indexPath, 'w', (err) => {
    if (err) throw err;
  });
  fs.open(cssBundle, 'w', (err) => {
    if (err) throw err;
  });
});

fs.rm(assetsDir, { recursive: true }, () => {
  readDir(path.resolve(__dirname, 'assets'), assetsDir);
});

// copy assets
function readDir(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const dirPath = path.resolve(src, file.name);
      const destPath = path.resolve(dest, file.name);
      if (file.isFile()) {
        fs.promises.copyFile(dirPath, destPath);
      } else {
        readDir(dirPath, destPath);
      }
    });
  });
}

// make index.html
async function generateHTML() {
  let indexHTML = await fs.promises.readFile(path.resolve(__dirname, 'template.html'), 'utf-8');
  const regMatch = indexHTML.matchAll(/{{([^}]+)}}/gi);

  for (let comp of regMatch) {
    const compName = comp[1];
    const htmlTag = await fs.promises.readFile(
      path.resolve(__dirname, 'components', `${compName}.html`)
    );
    indexHTML = indexHTML.replace(comp[0], htmlTag);
  }

  await fs.promises.writeFile(indexPath, indexHTML);
}

// make style bundle -> style.css
function BundleCSS() {
  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile()) {
        const extIndex = file.name.lastIndexOf('.');
        const fileExt = file.name.slice(extIndex + 1);
        if (fileExt === 'css') {
          const inputStream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name));
          inputStream.on('data', (data) => {
            fs.appendFile(cssBundle, data, (err) => {
              if (err) throw err;
            });
          });
        }
      }
    });
  });
}

generateHTML();
BundleCSS();
