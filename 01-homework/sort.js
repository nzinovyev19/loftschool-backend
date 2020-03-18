const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const [sourcePath, newPath, deleteSourcePath = ''] = process.argv.slice(2);

if (!sourcePath || !newPath) {
  process.exit(console.error('Не правильно указан исходный или будущий путь папок'));
}
if (!fs.existsSync(newPath)) {
  fs.mkdirSync(newPath);
}

const sortDir = (unsortedFilesPath, initNestedLevel) => {
  fs.readdir(unsortedFilesPath, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const filePath = path.join(unsortedFilesPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        sortDir(filePath, initNestedLevel + 1);
      } else {
        const firstSymbolFile = file.charAt().toUpperCase();
        const pathDirByFirstSymbol = path.join(newPath, firstSymbolFile);
        const pathFileInNewDir = path.join(pathDirByFirstSymbol, file);
        if (!fs.existsSync(pathDirByFirstSymbol)) {
          fs.mkdirSync(pathDirByFirstSymbol);
        }
        if (!fs.existsSync(pathFileInNewDir)) {
          fs.link(
            path.join(unsortedFilesPath, file),
            path.join(pathFileInNewDir),
            err => err && console.error(err)
          );
        }
      }
    });
  });
};

sortDir(sourcePath, 0);

if (deleteSourcePath === 'delete' || deleteSourcePath === '-d') {
  rimraf(sourcePath, () => console.log('Исходный файл успешно удален'));
}
