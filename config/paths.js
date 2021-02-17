const path = require('path');
const fs = require('fs');

const basePath = path.resolve(__dirname, '../');
const base = (path) => `${basePath}/${path}`;
const getDirectoryFileNames = (dir) => {
  const absoluteDirectoryPath = base(dir);
  const fileNames = fs.readdirSync(absoluteDirectoryPath);
  return fileNames.map(fileName => `${absoluteDirectoryPath}/${fileName}`)
}

module.exports = {
  distDir: base('dist'),
  clientDistDir: base('dist/public'),
  clientDir: base('src'),
  clientIndexFile: base('src/index.tsx'),
  clientIndexHtml: base('src/index.html'),
  serverDistDir: base('dist/server'),
  serverDir: base('server'),
  serverIndexFile: base('server/index.ts'),
  cssModuleRessourceFiles: getDirectoryFileNames('src/styles/ressources')
};
