const fs = require('fs');
const util = require('util');
const path = require('path');
const rimraf = require('rimraf');

const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);
const [sourcePath, newPath, deleteSourcePath = ''] = process.argv.slice(2);

async function sortDir (unsortedFilesPath, initNestedLevel) {
  const files = await readdir(unsortedFilesPath);
  files.forEach(async (file) => {
    const filePath = path.join(unsortedFilesPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      sortDir(filePath, initNestedLevel + 1);
    } else {
      const firstSymbolFile = file.charAt().toUpperCase();
      const pathDirByFirstSymbol = path.join(newPath, firstSymbolFile);
      const pathFileInNewDir = path.join(pathDirByFirstSymbol, file);
      if (!fs.existsSync(pathDirByFirstSymbol)) await fs.mkdirSync(pathDirByFirstSymbol);
      if (!fs.existsSync(pathFileInNewDir)) {
        fs.link(
          path.join(unsortedFilesPath, file),
          path.join(pathFileInNewDir),
          err => err && console.error(err)
        );
      }
    }
  });
}

if (!sourcePath || !newPath) {
  process.exit(console.error('Не правильно указан исходный или будущий путь папок'));
}

(async () => {
  if (!fs.existsSync(newPath)) await mkdir(newPath);
  await sortDir(sourcePath, 0);
  if (deleteSourcePath === 'delete' || deleteSourcePath === '-d') {
    rimraf(sourcePath, () => console.log('Исходный файл успешно удален'));
  }
})();
