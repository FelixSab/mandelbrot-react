const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');
const initLoaders = require('./loaders');

const config = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  const isProduction = !isDevelopment;

  const { fileLoader, babelLoader } = initLoaders(isDevelopment);

  return {
    target: 'node',
    entry: paths.serverIndexFile,
    mode: argv.mode,
    output: {
      filename: 'bundle.js',
      path: paths.serverDistDir
    },
    watch: isDevelopment,
    devServer: {
      contentBase: paths.serverDistDir,
      compress: true,
      port: 9090
    },
    devtool: 'eval',
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.webpack.js', '.ts', '.js'],
      modules: [paths.serverDir, 'node_modules'],
    },
    module: {
      rules: [
        {
          oneOf: [babelLoader, fileLoader]
        }
      ]
    },
    externals: [nodeExternals()],
  }
};

module.exports = config;
