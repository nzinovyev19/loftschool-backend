const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const runCommand = require('./utils');

const APP_PATH = require.resolve('./sort');

// TODO: create tests with snapshots

describe('sort script', () => {
  afterEach(() => {
    fsExtra.emptyDirSync('./data');
  });

  it('error if not have source and new paths', async () => {
    const stderr = await runCommand(`node ${APP_PATH}`);
    expect(stderr).toBe(`Не правильно указан исходный или будущий путь папок
`
    );
  });
  it('create sorted dir', () => {
    // TODO: create mock for delete and create new dir (structure) only in tests
  });
  it('if have "-d" flag delete source file', async () => {
    const stdout = await runCommand(`node ${APP_PATH} ${process.cwd()}/unsorted ${process.cwd()}/sorted -d`);
    const isExistUnsortedDir = fs.existsSync(path.join(process.cwd(), 'unsorted'));
    expect(stdout).toBe(`Исходный файл успешно удален
`
    );
    expect(isExistUnsortedDir).toBeFalsy();
  });
});
