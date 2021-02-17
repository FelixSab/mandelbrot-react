process.env.NODE_ENV = 'production';
const fs = require('fs-extra');
const { run } = require('parallel-webpack');
const paths = require('../../config/paths');

const createConfigs = require.resolve('../../config/parallel-webpack');

fs.emptyDirSync(paths.distDir);
const options = {
  watch: false,
  maxRetries: 3,
  stats: true,
  maxConcurrentWorkers: 2
};

run(createConfigs, options);
