process.env.NODE_ENV = 'development';
const fs = require('fs-extra');
const { run } = require('parallel-webpack');
const paths = require('../../config/paths');

const createConfigs = require.resolve('../../config/parallel-webpack');

const watchArg = '--watch';
const isWatch = !!process.argv.find(arg => arg === watchArg);
if (!isWatch) {
  fs.emptyDirSync(paths.distDir);
}

const options = {
  watch: isWatch,
  maxRetries: 3,
  stats: false,
  maxConcurrentWorkers: 2
};

run(createConfigs, options);
