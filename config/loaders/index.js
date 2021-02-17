const sassModuleLoader = require('./sassModule');
const sassLoader = require('./sass');
const fileLoader = require('./file');
const babelLoader = require('./babel');

module.exports = function(isDevelopment) {
  return {
    sassModuleLoader: sassModuleLoader(isDevelopment),
    sassLoader: sassLoader(isDevelopment),
    fileLoader: fileLoader(isDevelopment),
    babelLoader: babelLoader(isDevelopment)
  };
};
